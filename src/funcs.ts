import { modelData, sw, objAny, isModelFileObj, isModelDirObj } from "./types";
import { createOptions } from "./types";
import { Dir } from "./dir";
import { File } from "./file";
import { join } from "path";
import { readdirSync } from "fs";
import { mkdir as mkdirSync } from "./safe/mkdir";
import { stat } from "./safe/stat";
import { fsProErr } from "./fsProErr";

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
export function validate(path: string, data: modelData) {
  const dir = new Dir(path);
  if (!dir.exits()) throw new fsProErr("DDE", path);
  dir.read().forEach(prf => {
    // @ts-ignore
    // prettier-ignore
    const key = data[prf] ? prf: data[sliceFrom(prf, ".")]? sliceFrom(prf, ".") : data[prf].ext;
    const elem = data[key];
    const prfPath = join(path, prf);
    if (!elem) throw new fsProErr("IN", prfPath);
    if (stat(prfPath).isDirectory()) {
      if (isModelFileObj(elem)) throw new fsProErr("STF", prfPath);
      else if (isModelDirObj(elem)) {
        readdirSync(prfPath).forEach(thing => {
          const thingPath = join(prfPath, thing);
          if (stat(thingPath).isDirectory())
            throw new fsProErr("IN", thingPath);
          if (new File(thingPath).extension !== elem.fileType.ext)
            throw new fsProErr("WE", thingPath);
        });
      } else {
        validate(prfPath, elem);
      }
    } else {
      if (isModelDirObj(elem)) throw new fsProErr("STD", prfPath);
      else if (isModelFileObj(elem)) {
        if (elem.ext !== new File(prfPath).extension)
          throw new fsProErr("WE", prfPath);
      } else {
        throw new fsProErr("IN", prfPath);
      }
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (...args: any[]) => null;

const defaultOptions: createOptions = {
  onCreate: noop,
  onCreateFile: noop,
  onCreateDir: noop
};

export function create(
  path: string,
  stuck: sw<modelData>,
  options?: Partial<createOptions>
) {
  mkdirSync(path);
  const op = Object.assign({}, defaultOptions, options || {});
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
