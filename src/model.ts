import { join } from "path";
import { File } from "./file";
import {
  modelData,
  sw,
  modelFileObj,
  modelDirObj,
  createOptions,
  validateOptions,
} from "./types";
import { createAt, structureCreator, validate } from "./funcs";

/** the Model Class is used to create model objects that are used to create structures */
export class Model {
  /**
   * a methods represents a file
   * @param ext the extension of the file
   * @param defaultContent the default content you the file to have when it's created
   */
  public static File(
    ext: string,
    defaultContent?: Buffer | string,
    validator?: (this: File, content: string) => any
  ): modelFileObj {
    return { type: "file", ext, defaultContent, validator };
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
  structure<T extends modelData>(...paths: string[]): sw<T> {
    const path = join(...paths);
    const stuck = structureCreator<T>(this.data, path);
    stuck.__META__ = { path };
    return stuck;
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
  createAt<T extends modelData>(
    path: string,
    options?: Partial<createOptions>
  ): sw<T> {
    // @ts-ignore
    return createAt<T>(this.data, path, options);
  }
  /**
   * makes sure that a given directory matches a given
   * model
   * NOTE: throws an error if the directory is not valid see .valid()
   * ```js
   * model.validate(dirToValidate);
   * ```
   * @param data the model data you want to validate passed on
   * @param path the path of the file you want to validate
   * @param options functions to call on errors
   */
  validate(path: string, options?: Partial<validateOptions>) {
    validate(path, this.data, options);
  }

  /** the same as .validate() but don't throw an error and returns a boolean */
  valid(path: string) {
    try {
      this.validate(path);
      return true;
    } catch (error) {
      return false;
    }
  }
}
