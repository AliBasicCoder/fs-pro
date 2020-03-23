import { modelData, sw, objAny, isModelFileObj, isModelDirObj } from "./types";
import { createOptions } from "./types";
import { Structure } from "./structure";
import { Dir } from "./dir";
import { File } from "./file";
import { join } from "path";
import { readdirSync } from "fs";
import { stat } from "./safe/stat";

// functions used in model.ts

export function createAt<T extends modelData>(
  data: modelData,
  path: string,
  options?: Partial<createOptions>
): sw<T> {
  const stuck = structureCreator<T>(data, path);
  Structure.create(stuck, options);
  return stuck;
}

export function structureCreator<T extends modelData>(
  data: modelData,
  path: string
): sw<T> {
  const obj: objAny = {};
  for (const key in data) {
    const element = data[key];
    if (isModelFileObj(element))
      obj[key] = new File(path, `${key}${element.ext}`);
    else if (isModelDirObj(element)) obj[key] = new Dir(path, key);
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
  const keys = Object.keys(data);
  dir.read().forEach(prf => {
    const elem = data[prf];
    if (stat(prf).isDirectory()) {
      if (keys.indexOf(prf) === -1) throw new Error(`${prf} is not valid`);
      else if (isModelFileObj(elem))
        throw new Error(`${prf} supposed to be a file`);
      else if (isModelDirObj(elem)) {
        readdirSync(join(path, prf)).forEach(thing => {
          if (stat(join(path, prf, thing)).isDirectory())
            throw new Error("invalid directory found");
          if (new File(path, prf, thing).extension !== elem.fileType.ext)
            throw new Error(`file ${prf}/${thing} have a wrong extension`);
        });
      } else {
        validate(join(path, prf), elem);
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

export function create(stuck: sw<modelData>, options?: Partial<createOptions>) {
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
      create(stuck[key]);
    }
  }
}
