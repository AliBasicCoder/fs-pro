import { join } from "path";
import { File } from "./file";
import { Dir } from "./dir";
import {
  objAny,
  modelData,
  sw,
  isModelDirObj,
  isModelFileObj,
  modelFileObj,
  modelDirObj
} from "./types";

function createAt<T extends modelData>(data: modelData, path: string): sw<T> {
  const obj: objAny = {};
  for (const key in data) {
    const element = data[key];
    if (key === "__any" || key === "__any_dir") continue;
    if (isModelFileObj(element))
      obj[key] = new File(path, `${key}${element.ext}`).create();
    else if (isModelDirObj(element)) obj[key] = new Dir(path, key).create();
    else {
      obj[key] = createAt(element, join(path, key));
    }
  }
  // @ts-ignore
  return obj;
}

function structure<T extends modelData>(data: modelData, path: string): sw<T> {
  const obj: objAny = {};
  for (const key in data) {
    const element = data[key];
    if (key === "__any" || key === "__any_dir") continue;
    if (isModelFileObj(element))
      obj[key] = new File(path, `${key}${element.ext}`);
    else if (isModelDirObj(element)) obj[key] = new Dir(path, key);
    else {
      obj[key] = structure(element, join(path, key));
    }
  }
  // @ts-ignore
  return obj;
}

export class Model {
  /**
   * a methods represents a file
   * @param ext the extension of the file
   */
  public static File(ext: string): modelFileObj {
    return { type: "file", ext };
  }
  /**
   * a methods represents a dir
   * @param fileType the type of the file
   */
  public static Dir(fileType: modelFileObj): modelDirObj {
    return { type: "dir", fileType };
  }
  /**
   * create a Model object
   * ```js
   * const model = new Model({
   *   src: {
   *      file1: Model.File(".js")
   *   },
   *   ".gitignore": Model.File("")
   * })
   * modal.createAt(__dirname);
   * // ...
   * ```
   * @param data the object that represents the schema (model) your dir will be
   */
  constructor(public data: modelData) {}

  /**
   * create a structure of File and Dir objects
   * ```js
   * import { Model } from "fs-pro";
   *
   * const modelBase = {
   *   node_modules: Model.Dir(Model.File(".js"))
   * }
   *
   * const structure = (new Model(modelBase)).structure<typeof modelBase>(__dirname);
   *
   * structure.node_modules instanceof Dir === "true"
   * ```
   * @param path the path to use
   */
  structure<T extends modelData>(path: string): sw<T> {
    return structure<T>(this.data, path);
  }

  /**
   * create a structure of File and Dir objects
   * and calls .create in all of theme
   * @see https://fs-pro-docs.herokuapp.com/classes/_file_.file.html#create
   * @see https://fs-pro-docs.herokuapp.com/classes/_dir_.dir.html#create
   *
   * example:
   * ```js
   * import { Model } from "fs-pro";
   *
   * const modelBase = {
   *   node_modules: Model.Dir(Model.File(".js"))
   * }
   *
   * const structure = (new Model(modelBase)).createAt<typeof modelBase>(__dirname);
   *
   * structure.node_modules instanceof Dir === "true"
   * ```
   * @param path the path to create files at
   */
  createAt<T extends modelData>(path: string): sw<T> {
    return createAt<T>(this.data, path);
  }
}
