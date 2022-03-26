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

export const __rest = Symbol("__rest");

export type ShapeObjWithoutName = {
  [__rest]?: ShapeFilePattern | ShapeObj;
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
   * the Shape class is a class that helps you create folder with a certain shape (hierarchy)
   * or test if a folder have a certain shape (hierarchy)
   * example 1:
   * imagine that you want to test if a folder
   * (1) has a folder named "js_ts_files" which only contains js or ts files
   * (2) has a folder named "text_folders" which only contains folder with contains text files
   * (3) has an empty folder named "empty_folder"
   * (4) everything else in the folder must be a json file
   * ```js
   * import { Shape, __rest } from "fs-pro";
   * // (1) create the shape
   * const shape = new Shape({
   *    // a key to reference in the code (if you need)
   *    js_ts_files:
   *       // Shape.Dir means this should be a folder named "js_ts_files"
   *       Shape.Dir(
   *          // the name of the folder in the file system
   *          "js_ts_files",
   *          // the pattern of the files (you could also use regexs)
   *          Shape.Pattern("*.js|*.ts")
   *       ),
   *    // passing an oject this folder must folder this shape (hierarchy)
   *    text_folders: Shape.Dir("text_folders", {
   *       // __rest means anything else in the folder
   *       //  and because we set __rest here as an object it means that
   *       //  __rest is a folder
   *       [__rest]: {
   *         [__rest]: Shape.Pattern("*.txt")
   *      }
   *    }),
   *    // this regex doesn't match anything except an empty string
   *    // so it wont match any file name so the folder must be empty
   *    empty_folder: Shape.Dir("empty_folder", Shape.Pattern(/$^/)),
   *    // __rest means any thing else (not mentioned)
   *    // Shape.Pattern means it must be a file following
   *    // the given pattern
   *    [__rest]: Shape.Pattern("*.json")
   * });
   *
   * // (2) test if a folder follows it
   * // this will throw an error if the folder doesn't match the shape
   * shape.validate("/path/to/folder", true);
   * // or if you want more details
   * console.log(shape.validate("/path/to/folder"));
   * // this will not throw an error even if the folder doesn't match the shape
   * // but it will log an array of errors saying where the folder doesn't match
   * // the shape
   * ```
   *
   * example 2:
   * imagine that you want to create a
   * (1) folder named "something" that has a file named "hi.txt" and contains "hello world"
   * (2) you want to log the path of everything created
   * ```js
   * // (1) create the shape
   * const shape = new Shape({
   *   something: {
   *     hi: Shape.File("hi.txt", "hello world")
   *   }
   * });
   *
   * // (2) use createShapeInst
   * shape.createShapeInst("/path/to/folder", {
   *   // gets called when a file or folder is created
   *   onCreate(fileOrFolder) {
   *     console.log(fileOrFolder.path);
   *   }
   * });
   * ```
   * @param shape
   */
  constructor(shape: T) {
    this.shapeObj = shape;
  }

  /**
   * use this method for adding file patterns to your shape
   * see Shape.constructor docs for more details {@link Shape.constructor}
   * NOTE: if you use string as pattern it will be converted to a regex like this:
   * 1. convert any "*" to ".*" (unless there's a backslash before it)
   * 2. it splits the regex by "|" and test every one separately (unless there's a backslash before it)
   * @param pattern regex or string
   * @param defaultContent if you want files to be created with some content
   * @param validator if you want to validate the content of the file
   */
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
   * see Shape.constructor docs for more details {@link Shape.constructor}
   * @param base the base (name with extension) of the file
   * @param defaultContent file default content (content will be added on creation)
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
   * use this method for adding folder to you shape
   * see Shape.constructor docs for more details {@link Shape.constructor}
   * @param name name of the folder
   * @param fileTypeOrShapeObj file type of the Shape Obj
   */
  static Dir(name: string, fileType: ShapeFile | ShapeFilePattern): ShapeDir;
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
    if (fileTypeOrShapeObj.__rest) {
      console.warn(
        `W02: please use __rest symbol instead of "__rest" https://github.com/AliBasicCoder/fs-pro/blob/master/NOTES.md`
      );
    }
    return {
      [name_sym]: name,
      ...fileTypeOrShapeObj,
    } as ShapeObj;
  }

  /**
   * use this method to create a folder with matches the shape
   * example for eventsListeners
   * ```js
   * const shape = new Shape({ ... });
   *
   * shape.createShapeInst("/path/to/folder", {
   *   onCreate(fileOrFolder) {
   *     console.log(`CREATED: ${fileOrFolder.path}`);
   *   }
   * })
   * ```
   * @param path the path you want to create
   * @param eventsListeners listen to some event
   */
  createShapeInst(path: string, eventsListeners?: createEvents) {
    return createShapeInst(
      this.shapeObj,
      path,
      eventsListeners
    ) as switchToShapeInstRef<T>;
  }

  /**
   * use this method to check if a folder follows the shape
   * see Shape.constructor docs for more details {@link Shape.constructor}
   * @param path the path to check
   * @param crash if true will throw an error if the folder doesn't match the shape
   */
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
    if (shapeObj.__rest || shapeObj[__rest])
      errs.push(
        check(shapeObj.__rest || shapeObj[__rest], fileOrDir, crash, true)
      );
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
