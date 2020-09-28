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
    if (key === "__name") continue;
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
        if (!element.__name)
          throw new Error(`directory with key ${key} missing name`);
        result[key] = createShapeInst(
          element,
          join(parentDir.path, element.__name),
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
    if (key === "__name" || key === "__rest") continue;
    if (Object.prototype.hasOwnProperty.call(shapeObj, key)) {
      const element = shapeObj[key];
      const name =
        isDirType(element) || isFileType(element)
          ? element.str
          : element.__name || "";
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

export class Shape {
  shapeObj: ShapeObj;

  constructor(shape: ShapeObj) {
    this.shapeObj = shape;
  }

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

  static Dir(str: string, fileType: fileType): dirType {
    return {
      __isDir: true,
      str,
      fileType,
    };
  }

  createShapeInst(path: string, eventsListeners?: createEvents) {
    return createShapeInst(this.shapeObj, path, eventsListeners);
  }

  validate(path: string, crash?: boolean) {
    return validate(path, this.shapeObj, crash);
  }
}
