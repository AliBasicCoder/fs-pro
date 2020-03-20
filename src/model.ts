import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { File } from "./file";
import { Dir } from "./dir";
import { obj } from "./types";

interface modelObjBase<T extends string> {
  type: T;
}

type modelFileObj = modelObjBase<"file"> & { ext: string };
type modelDirObj = modelObjBase<"dir"> & { fileType: modelFileObj };

interface modelData {
  // @ts-ignore
  __any?: modelFileObj;
  // @ts-ignore
  __any_dir?: modelDirObj;
  [key: string]: modelDirObj | modelFileObj | modelData;
}

type sw<T extends modelData> = {
  [K in keyof T]: T[K] extends modelFileObj
    ? File
    : T[K] extends modelDirObj
    ? Dir
    : T[K] extends modelData
    ? sw<T[K]>
    : any;
};

const isModelFileObj = (obj: any): obj is modelFileObj => obj.type === "file";
const isModelDirObj = (obj: any): obj is modelDirObj => obj.type === "dir";

function createAt(data: modelData, path: string) {
  mkdirSync(path);
  for (const key in data) {
    const element = data[key];
    if (key === "__any" || key === "__any_dir") continue;
    if (isModelFileObj(element))
      writeFileSync(join(path, `${key}${element.ext}`), "");
    else if (isModelDirObj(element)) mkdirSync(join(path, key));
    else {
      createAt(element, join(path, key));
    }
  }
}

function model<T extends modelData>(data: modelData, path: string): sw<T> {
  const obj: obj<any> = {};
  for (const key in data) {
    const element = data[key];
    if (key === "__any" || key === "__any_dir") continue;
    if (isModelFileObj(element))
      obj[key] = new File(path, `${key}${element.ext}`);
    else if (isModelDirObj(element)) obj[key] = new Dir(path, key);
    else {
      obj[key] = model(element, join(path, key));
    }
  }
  // @ts-ignore
  return obj;
}

export class Model {
  public static File(ext: string): modelFileObj {
    return { type: "file", ext };
  }

  public static Dir(fileType: modelFileObj): modelDirObj {
    return { type: "dir", fileType };
  }

  constructor(public data: modelData) {}

  model<T extends modelData>(path: string): sw<T> {
    return model<T>(this.data, path);
  }

  createAt(path: string) {
    createAt(this.data, path);
  }
}
