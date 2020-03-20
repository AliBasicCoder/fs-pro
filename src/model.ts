import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

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

export class Model {
  public static File(ext: string): modelFileObj {
    return { type: "file", ext };
  }

  public static Dir(fileType: modelFileObj): modelDirObj {
    return { type: "dir", fileType };
  }

  constructor(public data: modelData) {}

  createAt(path: string) {
    createAt(this.data, path);
  }
}
