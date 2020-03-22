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
import { mkdir as mkdirSync } from "./safe/mkdir";

function createAt<T extends modelData>(data: modelData, path: string): sw<T> {
  mkdirSync(path);
  const obj: objAny = {};
  for (const key in data) {
    const element = data[key];
    if (isModelFileObj(element)) {
      obj[key] = new File(path, `${key}${element.ext}`).write(
        element.defaultContent || ""
      );
    } else if (isModelDirObj(element)) obj[key] = new Dir(path, key).create();
    else {
      obj[key] = createAt(element, join(path, key));
    }
  }
  // @ts-ignore
  return obj;
}

function structureCreator<T extends modelData>(
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

export class Model {
  /**
   * a methods represents a file
   * @param ext the extension of the file
   * @param defaultContent the default content you the file to have when it's created
   */
  public static File(
    ext: string,
    defaultContent?: Buffer | string
  ): modelFileObj {
    return { type: "file", ext, defaultContent };
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
    return structureCreator<T>(this.data, path);
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
    // @ts-ignore
    return createAt<T>(this.data, path);
  }
}
