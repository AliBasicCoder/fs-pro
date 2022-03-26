import { BufferType } from "./types.ts";
import { Dir } from "./dir.ts";
import { File } from "./file.ts";
import { join } from "./path.ts";
import { fsProErr } from "./fsProErr.ts";
import { existsSync } from "./fs.ts";

export type ShapeFile = {
  type: 0;
  defaultContent?: string | BufferType;
  validator?: (this: File) => Error[] | void;
  base: string;
};

export type ShapeDir = {
  type: 1;
  name: string;
  filePattern: ShapeFilePattern;
};

export type ShapeFilePattern = {
  type: 2;
  defaultContent?: string | BufferType;
  validator?: (this: File) => Error[] | void;
  regex: RegExp;
};

export const name_sym = Symbol("__name");

export const rest_sym = Symbol("__rest");

export type ShapeObjWithoutName = {
  __rest?: ShapeObj | ShapeFilePattern | ShapeDir | ShapeFile;
} & {
  [rest_sym]?: ShapeFilePattern;
  [key: string]: ShapeObj | ShapeFile | ShapeDir;
};

export type ShapeObj = ShapeObjWithoutName & {
  [name_sym]?: string;
};

export const isShapeFile = (obj: any): obj is ShapeFile => obj.type === 0;

export const isShapeDir = (obj: any): obj is ShapeDir => obj.type === 1;

export const isShapeFilePattern = (obj: any): obj is ShapeFilePattern =>
  obj.type === 2;

export type createEvents = {
  onCreate?: (thing: File | Dir) => any;
  onCreateFile?: (file: File) => any;
  onCreateDir?: (thing: Dir) => any;
};

export type errArr = {
  arr: fsProErr[];
  push: (err?: fsProErr | errArr) => void;
};

export const isErrArr = (obj?: any): obj is errArr => obj.arr && obj.push;

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

  static Pattern(
    pattern: string | RegExp,
    defaultContent?: string | BufferType,
    validator?: ShapeFilePattern["validator"]
  ): ShapeFilePattern {
    let regex: RegExp;
    if (typeof pattern === "string") {
      const _ = convertPatternToRegex(pattern);
      if (!_[1])
        console.warn(
          `W00: looks like the pattern you entered is a static file name please use a Shape Object instead https://github.com/AliBasicCoder/fs-pro/blob/master/NOTES.md`
        );
      regex = _[0];
    } else regex = pattern;
    return {
      type: 2,
      regex,
      validator,
      defaultContent,
    };
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
    base: string,
    defaultContent?: string | BufferType,
    validator?: ShapeFile["validator"]
  ): ShapeFile {
    return {
      type: 0,
      defaultContent,
      validator,
      base,
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
  static Dir(name: string, fileType: ShapeFile): ShapeDir;
  static Dir<K extends ShapeObjWithoutName>(
    name: string,
    shapeObj: K
  ): K & { [name_sym]: string };
  static Dir(
    name: string,
    fileTypeOrShapeObj: ShapeFile | ShapeFilePattern | ShapeObjWithoutName
  ): ShapeDir | ShapeObj {
    if (isShapeFilePattern(fileTypeOrShapeObj)) {
      return {
        type: 1,
        name,
        filePattern: fileTypeOrShapeObj,
      } as ShapeDir;
    }
    if (isShapeFile(fileTypeOrShapeObj)) {
      const [regex, isPattern] = convertPatternToRegex(fileTypeOrShapeObj.base);

      if (isPattern)
        console.warn(
          `W01: looks like you passed a pattern to Shape.File use Shape.Pattern instead https://github.com/AliBasicCoder/fs-pro/blob/master/NOTES.md`
        );

      return {
        type: 1,
        name,
        filePattern: {
          type: 2,
          regex,
          validator: fileTypeOrShapeObj.validator,
          defaultContent: fileTypeOrShapeObj.defaultContent,
        },
      };
    }
    return {
      [name_sym]: name,
      ...fileTypeOrShapeObj,
    } as ShapeObj;
  }

  createShapeInst(path: string, eventsListeners?: createEvents) {
    return createShapeInst(
      this.shapeObj,
      path,
      eventsListeners
    ) as switchToShapeInstRef<T>;
  }

  validate(path: string, crash?: boolean) {
    return validate(path, this.shapeObj, crash);
  }
}

type switchToShapeInstRef<T extends ShapeObj> = {
  [K in keyof T]: T[K] extends ShapeFile
    ? File
    : T[K] extends ShapeDir
    ? Dir
    : T[K] extends ShapeObj
    ? switchToShapeInstRef<T[K]>
    : null;
} & {
  __dir: Dir;
};

function convertPatternToRegex(pattern: string): [RegExp, boolean] {
  const orRegex = /[^\\]\|/g;
  const regexs: string[] = [];
  if (orRegex.test(pattern)) {
    let arr: RegExpExecArray | null = null;
    while ((arr = orRegex.exec(pattern)) !== null) {
      regexs.push(arr[0].slice(1));
    }
    let result = "";
    for (const regex of regexs) {
      result += `(${convertPatternToRegex(regex)[0].source})|`;
    }

    return [RegExp(result.slice(0, -1)), true];
  } else {
    const starRegex = /(^|[^\\])\*/g;
    let found = false;
    pattern = pattern.replace(/\./g, "\\.");
    pattern = pattern.replace(starRegex, (fnd) => {
      found = true;
      return `${fnd === "*" ? "" : fnd[0]}.*`;
    });

    return [RegExp(pattern), found];
  }
}

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
  const result = {} as any;
  const eventRegister = createEventRegister(eventsListeners);
  eventRegister(parentDir);
  for (const key in shapeObj) {
    if (key === "__rest") continue;
    if (Object.prototype.hasOwnProperty.call(shapeObj, key)) {
      const element = shapeObj[key];
      if (isShapeFile(element)) {
        const file = new File(parentDir.path, element.base);
        result[key] = file;
        if (element.defaultContent)
          file.defaultContent = element.defaultContent;
        file.create();
        eventRegister(file);
      } else if (isShapeDir(element)) {
        const dir = new Dir(parentDir.path, element.name).create();
        eventRegister(dir);
        result[key] = dir;
      } else {
        if (!element[name_sym])
          throw new Error(`Use Shape.Dir() instead of raw object in ${key}`);
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

function validate(path: string, shapeObj: ShapeObj, crash = false) {
  const errs = errArray(crash);
  const namesChecked = [] as string[];
  for (const key in shapeObj) {
    if (key === "__rest") continue;
    if (!Object.prototype.hasOwnProperty.call(shapeObj, key)) continue;
    const element = shapeObj[key];
    let name = "";
    if (isShapeDir(element)) name = element.name;
    else if (isShapeFile(element)) name = element.base;
    else name = element[name_sym] || "";
    const elementPath = join(path, name);
    if (!existsSync(elementPath)) {
      errs.push(new fsProErr(isShapeDir(element) ? "DDE" : "FDE", elementPath));
      continue;
    }
    errs.push(check(element, toFileOrDir(elementPath), crash));
    namesChecked.push(name);
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

function check(
  currentObj: ShapeObj | ShapeFile | ShapeDir | ShapeFilePattern,
  fileOrDir: File | Dir,
  crash: boolean,
  isRest = false
) {
  if (isShapeFile(currentObj)) {
    if (fileOrDir instanceof Dir) {
      return new fsProErr("STF", fileOrDir.path);
    }
    if (currentObj.validator) {
      fileOrDir.validator = currentObj.validator;
      fileOrDir.validate();
    }
    return;
  }
  if (isShapeDir(currentObj)) {
    if (fileOrDir instanceof File) return new fsProErr("STD", fileOrDir.path);
    const errs = errArray(crash);
    fileOrDir.forEach((fileOrDir2) => {
      if (fileOrDir2 instanceof Dir) {
        errs.push(new fsProErr("IDF", fileOrDir2.path));
        return;
      }
      if (!currentObj.filePattern.regex.test(fileOrDir2.base)) {
        errs.push(new fsProErr("IFF", fileOrDir2.path));
        return;
      }
    });
    return errs;
  }
  if (isShapeFilePattern(currentObj)) {
    if (fileOrDir instanceof Dir) {
      return new fsProErr("STF", fileOrDir.path);
    }
    if (!currentObj.regex.test(fileOrDir.base)) {
      return new fsProErr("IFF", fileOrDir.path);
    }
    if (currentObj.validator) {
      fileOrDir.validator = currentObj.validator;
      fileOrDir.validate();
    }
    return;
  }
  return validate(fileOrDir.path, currentObj, crash);
}
