import { modelData, sw } from "./types";
import { File } from "./file";
import { Dir } from "./dir";
import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { stat } from "./safe/stat";
import { isModelFileObj, isModelDirObj } from "./types";

function validate(path: string, data: modelData) {
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

function create(stuck: sw<modelData>) {
  for (const key in stuck) {
    if (stuck[key] instanceof File) {
      stuck[key].create();
    } else if (stuck[key] instanceof Dir) {
      stuck[key].create();
    } else {
      create(stuck[key]);
    }
  }
}

export class Structure<T extends modelData> {
  public static create(stuck: sw<modelData>) {
    create(stuck);
    return this;
  }

  public static exits(path: string) {
    return existsSync(path);
  }

  public static validate(data: modelData, path: string) {
    if (!this.exits(path)) throw new Error("directory does not exits");
    validate(path, data);
  }

  public static valid(data: modelData, path: string) {
    try {
      this.validate(data, path);
      return true;
    } catch (error) {
      return false;
    }
  }
}
