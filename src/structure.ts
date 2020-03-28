import { modelData, sw, createOptions, validateOptions } from "./types";
import { create, validate } from "./funcs";

/** the Structure Class is a set of tools help you work with structures */
export class Structure {
  /**
   * creates the structure
   * example
   * ```js
   * Structure.create(path, stuck, {
   *   onCreateFile (file) {
   *     console.log(chalk.green("CREATE"), file.path);
   *   }
   * })
   * ```
   * @param path the you want to create the structure in
   * @param stuck the structure
   * @param options options
   */
  public static create(
    path: string,
    stuck: sw<modelData>,
    options?: Partial<createOptions>
  ) {
    create(path, stuck, options);
    return this;
  }

  /**
   * makes sure that a given directory matches a given
   * model
   * NOTE: throws an error if the directory is not valid see .valid()
   * ```js
   * Structure.validate(model.data, dirToValidate);
   * ```
   * @param data the model data you want to validate passed on
   * @param path the path of the file you want to validate
   * @param options functions to call on errors
   */
  public static validate(
    data: modelData,
    path: string,
    options?: Partial<validateOptions>
  ) {
    validate(path, data, options);
  }

  /** the same as .validate() but don't throw an error and returns a boolean */
  public static valid(data: modelData, path: string) {
    try {
      this.validate(data, path);
      return true;
    } catch (error) {
      return false;
    }
  }
}
