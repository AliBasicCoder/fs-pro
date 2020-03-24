import {
  modelData,
  sw,
  objAny,
  isModelFileObj,
  isModelDirObj,
  validateOptions
} from "./types";
import { createOptions } from "./types";
import { Dir } from "./dir";
import { File } from "./file";
import { join } from "path";
import { readdirSync } from "fs";
import { mkdir as mkdirSync } from "./safe/mkdir";
import { stat } from "./safe/stat";
import { fsProErr } from "./fsProErr";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (...args: any[]) => null;

const createDefaultOptions: createOptions = {
  onCreate: noop,
  onCreateFile: noop,
  onCreateDir: noop
};

const validateDefaultOptions: validateOptions = {
  onInvalid: noop,
  onInvalidDir: noop,
  onInvalidFile: noop
};

function sliceFrom(str: string, char: string) {
  const index = str.indexOf(char);
  if (index === -1) return str;
  return str.slice(0, index);
}

// functions used in model.ts

export function createAt<T extends modelData>(
  data: modelData,
  path: string,
  options?: Partial<createOptions>
): sw<T> {
  const stuck = structureCreator<T>(data, path);
  create(path, stuck, options);
  return stuck;
}

export function structureCreator<T extends modelData>(
  data: modelData,
  path: string
): sw<T> {
  const obj: objAny = {};
  for (const key in data) {
    const element = data[key];
    if (isModelFileObj(element)) {
      obj[key] = new File(path, `${key}${element.ext}`);
      obj[key].defaultContent = element.defaultContent;
    } else if (isModelDirObj(element)) obj[key] = new Dir(path, key);
    else {
      obj[key] = structureCreator(element, join(path, key));
    }
  }
  // @ts-ignore
  return obj;
}

// function used in structure.ts
export function validate(
  path: string,
  data: modelData,
  options?: Partial<validateOptions>
) {
  const dir = new Dir(path);
  const op = Object.assign({}, validateDefaultOptions, options || {});
  function regErr(err: fsProErr) {
    if (typeof options === "undefined") throw err;
    if (err.code === "STD" || err.code === "WE" || err.code === "IFF") {
      op.onInvalidFile(err, new File(err.path));
      op.onInvalid(err, new File(err.path));
    } else if (err.code === "STF" || err.code === "IDF") {
      op.onInvalidDir(err, new Dir(err.path));
      op.onInvalid(err, new Dir(err.path));
    } else {
      op.onInvalid(
        err,
        stat(err.path).isDirectory() ? new Dir(err.path) : new File(err.path)
      );
    }
  }
  if (!dir.exits()) {
    regErr(new fsProErr("DDE", path));
    return;
  }
  dir.read().forEach(prf => {
    // @ts-ignore
    // prettier-ignore
    const key = data[prf] ? prf: data[sliceFrom(prf, ".")]? sliceFrom(prf, ".") : data[prf].ext;
    const elem = data[key];
    const prfPath = join(path, prf);
    if (!elem) {
      regErr(new fsProErr("IN", prfPath));
      return;
    }
    if (stat(prfPath).isDirectory()) {
      if (isModelFileObj(elem)) {
        regErr(new fsProErr("STF", prfPath));
        return;
      } else if (isModelDirObj(elem)) {
        readdirSync(prfPath).forEach(thing => {
          const thingPath = join(prfPath, thing);
          if (stat(thingPath).isDirectory()) {
            regErr(new fsProErr("IN", thingPath));
            return;
          }
          if (new File(thingPath).extension !== elem.fileType.ext) {
            regErr(new fsProErr("WE", thingPath));
            return;
          }
        });
      } else {
        validate(prfPath, elem, options);
      }
    } else {
      if (isModelDirObj(elem)) {
        regErr(new fsProErr("STD", prfPath));
        return;
      } else if (isModelFileObj(elem)) {
        if (elem.ext !== new File(prfPath).extension) {
          regErr(new fsProErr("WE", prfPath));
          return;
        }
      } else {
        regErr(new fsProErr("IN", prfPath));
        return;
      }
    }
  });
}

export function create(
  path: string,
  stuck: sw<modelData>,
  options?: Partial<createOptions>
) {
  mkdirSync(path);
  const op = Object.assign({}, createDefaultOptions, options || {});
  for (const key in stuck) {
    if (stuck[key] instanceof File) {
      stuck[key].create();
      op.onCreate(stuck[key]);
      op.onCreateFile(stuck[key]);
    } else if (stuck[key] instanceof Dir) {
      stuck[key].create();
      op.onCreate(stuck[key]);
      op.onCreateDir(stuck[key]);
    } else {
      create(join(path, key), stuck[key], options);
    }
  }
}
