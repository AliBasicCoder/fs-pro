import {
  objAny,
  ShapeObj,
  createEvents,
  isDirType,
  isFileType,
  fileType,
  dirType,
  errArr,
  isErrArr,
  ShapeObjWithoutName,
  name_sym,
} from "./types";
import { Dir } from "./dir";
import { File } from "./file";
import { join } from "./path";
import { fsProErr } from "./fsProErr";
import { existsSync } from "./fs";

function createEventRegister(eventsListeners?: createEvents) {
  return (thing: File | Dir) => {
    if (!eventsListeners) return;
    if (eventsListeners.onCreate) eventsListeners.onCreate(thing);
    if (thing instanceof Dir && eventsListeners.onCreateDir)
      eventsListeners.onCreateDir(thing);
    if (thing instanceof File && eventsListeners.onCreateFile)
      eventsListeners.onCreateFile(thing);
  };
}

function createShapeInst(
  shapeObj: ShapeObj,
  path: string,
  eventsListeners?: createEvents
) {
  const parentDir = new Dir(path).create();
  const result: objAny = {};
  const eventRegister = createEventRegister(eventsListeners);
  eventRegister(parentDir);
  for (const key in shapeObj) {
    if (key === "__rest") continue;
    if (Object.prototype.hasOwnProperty.call(shapeObj, key)) {
      const element = shapeObj[key];
      if (isFileType(element)) {
        const file = new File(parentDir.path, element.str);
        result[key] = file;
        if (element.dfCont) file.defaultContent = element.dfCont;
        file.create();
        eventRegister(file);
      } else if (isDirType(element)) {
        const dir = new Dir(parentDir.path, element.str).create();
        eventRegister(dir);
        result[key] = dir;
      } else {
        if (!element[name_sym])
          throw new Error(`directory with key ${key} missing name`);
        result[key] = createShapeInst(
          element,
          join(parentDir.path, element[name_sym] || ""),
          eventsListeners
        );
      }
    }
  }
  result.__dir = parentDir;
  return result;
}

function checkStrMatchRgx(base: string, regex: string): boolean {
  // *.ts or *.ts|*.txt or some_*.txt or some_[0-9].txt
  const orRegex = /[^\\]\|/g;
  const rgxs: string[] = [];
  if (orRegex.test(regex)) {
    let arr: RegExpExecArray | null = null;
    while ((arr = orRegex.exec(regex)) !== null) {
      rgxs.push(arr[0].slice(1));
    }
    for (const rgx of rgxs) {
      if (!checkStrMatchRgx(base, rgx)) return false;
    }
    return true;
  } else {
    const starRegex = /(^|[^\\])\*/g;
    // const groupRegex = /(^|[^\\])\[.*[^\\]\]/g;
    regex = regex.replace(/\./g, "\\.");
    // @ts-ignore
    regex = regex.replace(starRegex, (fnd) => `${fnd === "*" ? "" : fnd[0]}.*`);
    return RegExp(regex).test(base);
  }
}

function check(
  currentObj: ShapeObj | fileType | dirType,
  fileOrDir: File | Dir,
  crash: boolean,
  isRest: boolean = false
) {
  if (isFileType(currentObj)) {
    if (fileOrDir instanceof Dir) {
      return new fsProErr("STF", fileOrDir.path);
    } else {
      if (isRest && !checkStrMatchRgx(fileOrDir.base, currentObj.str)) {
        return new fsProErr("IFF", fileOrDir.path);
      }
      if (currentObj.validator) {
        fileOrDir.validator = currentObj.validator;
        fileOrDir.validate();
      }
    }
    return;
  }
  if (isDirType(currentObj)) {
    if (fileOrDir instanceof File) return new fsProErr("STD", fileOrDir.path);
    const errs = errArray(crash || false);
    fileOrDir.forEach((fileOrDir2) => {
      if (fileOrDir2 instanceof Dir) {
        errs.push(new fsProErr("IDF", fileOrDir2.path));
        return;
      }
      if (!checkStrMatchRgx(fileOrDir2.base, currentObj.fileType.str)) {
        errs.push(new fsProErr("IFF", fileOrDir2.path));
        return;
      }
    });
    return errs;
  }
  return validate(fileOrDir.path, currentObj, crash);
}

function errArray(crash: boolean): errArr {
  return {
    arr: [] as fsProErr[],
    push(err?: fsProErr | errArr) {
      if (!err) return;
      if (crash) throw err;
      if (isErrArr(err)) this.arr.push(...err.arr);
      else this.arr.push(err);
    },
  };
}

function toFileOrDir(path: string) {
  try {
    return new Dir(path);
  } catch (error) {
    return new File(path);
  }
}

function validate(path: string, shapeObj: ShapeObj, crash: boolean = false) {
  const errs = errArray(crash);
  const namesChecked: string[] = [];
  for (const key in shapeObj) {
    if (key === "__rest") continue;
    if (Object.prototype.hasOwnProperty.call(shapeObj, key)) {
      const element = shapeObj[key];
      const name =
        isDirType(element) || isFileType(element)
          ? element.str
          : element[name_sym] || "";
      const elementPath = join(path, name);
      if (!existsSync(elementPath)) {
        errs.push(
          new fsProErr(isDirType(element) ? "DDE" : "FDE", elementPath)
        );
        continue;
      }
      errs.push(check(element, toFileOrDir(elementPath), crash));
      namesChecked.push(name);
    }
  }
  const restFiles = new Dir(path).readResolve().filter((fileOrDir) => {
    // @ts-ignore
    if (namesChecked.includes(fileOrDir.base || fileOrDir.name)) return false;
    return true;
  });
  restFiles.forEach((fileOrDir) => {
    if (shapeObj.__rest)
      errs.push(check(shapeObj.__rest, fileOrDir, crash, true));
    else
      errs.push(
        new fsProErr(fileOrDir instanceof Dir ? "IDF" : "IFF", fileOrDir.path)
      );
  });
  return errs;
}

export class Shape<T extends ShapeObj> {
  shapeObj: ShapeObj;

  /**
   * the Shape class is a class that helps you manage your directory
   * the Shape instance (or inst for short) is the Shape applied to a directory
   * the Shape instance reference is a JS object the references the Shape instance
   * the Shape constructor takes the Shape of your directory
   * every key in the object passed in is an identifier for the file or dir
   * @NOTE DO NOT use these keys any where inside the shape "__dir",
   * "__rest", "__isFile", "__isDir"
   * @example ```js
   * const shape = new Shape({
   *   // for adding files use Shape.File with the file name
   *   some_file: Shape.File("some_file.txt"),
   *   // for adding a directory of files use Shape.Dir with
   *   // the dir name and file name regex (a custom type of regex to test if the filename matches it)
   *   // see Shape.File doc for more information about filename regex
   *   some_dir: Shape.Dir("some_dir", Shape.File("test[0-9]{3}.txt|*.any")),
   *   // for adding a shaped folder use Shape.Dir with the directory name
   *   // and the shape of it
   *   some_shaped_dir: Shape.Dir("shaped_dir", {
   *     file_1: Shape.File("file_1.txt"),
   *     // ...
   *   }),
   *   // __rest tells Shape that any thing not mentioned
   *   // must follow the given shape
   *   __rest: Shape.File("*.txt"),
   * });
   * ```
   * @param shape the shape
   */
  constructor(shape: T) {
    this.shapeObj = shape;
  }

  /**
   * use this method for adding files to your shape
   * @NOTE file regex are different than normal regex
   * 1. Shape every convert any "*" to ".*" (unless it's backslashed)
   * 2. it splits the regex by "|" and test every one separately (unless it's backslashed)
   * @example ```js
   * const shape = new Shape({
   *   some_file: Shape.File("file_name")
   * });
   * ```
   * @param str the filename or match regex
   * @param dfCont file default content (content will be added on creation)
   * @param validator a function used to validate the file
   */
  static File(
    str: string,
    dfCont?: string | Buffer,
    validator?: fileType["validator"]
  ): fileType {
    return {
      __isFile: true,
      dfCont,
      validator,
      str,
    };
  }

  /**
   * use this method to define a directory
   * @example ```js
   * const shape = new Shape({
   *   // example for defining a Dir including only files the match
   *   // the Shape.File passed in
   *   some_dir: Shape.Dir("dir_name", Shape.File("test[0-100].txt")),
   *   // example for defining a Dir when a schema
   *   some_shaped_dir: Shape.Dir("dir_name", {
   *     some_file: Shape.File("some_name")
   *     // ...
   *   }),
   * });
   * ```
   * @param str the directory name
   * @param fileTypeOrShapeObj file type of the Shape Obj
   */
  static Dir(str: string, fileType: fileType): dirType;
  static Dir<T extends string, K extends ShapeObjWithoutName>(
    str: T,
    shapeObj: K
  ): K & { [name_sym]: T };
  static Dir(
    str: string,
    fileTypeOrShapeObj: fileType | ShapeObjWithoutName
  ): dirType | ShapeObj {
    if (isFileType(fileTypeOrShapeObj)) {
      return {
        __isDir: true,
        str,
        fileType: fileTypeOrShapeObj,
      };
    } else {
      // @ts-ignore
      return {
        [name_sym]: str,
        ...fileTypeOrShapeObj,
      };
    }
  }

  createShapeInst(
    path: string,
    eventsListeners?: createEvents
  ): switchToShapeInstRef<T> {
    // @ts-ignore
    return createShapeInst(this.shapeObj, path, eventsListeners);
  }

  validate(path: string, crash?: boolean) {
    return validate(path, this.shapeObj, crash);
  }
}

type switchToShapeInstRef<T extends ShapeObj> = {
  [K in keyof T]: T[K] extends fileType
    ? File
    : T[K] extends dirType
    ? Dir
    : T[K] extends ShapeObj
    ? switchToShapeInstRef<T[K]>
    : null;
} & {
  __dir: Dir;
};
