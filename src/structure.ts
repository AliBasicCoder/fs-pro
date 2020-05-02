import { modelData, sw, createOptions } from "./types";
import { create } from "./funcs";

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
  public static create(stuck: sw<modelData>, options?: Partial<createOptions>) {
    create(stuck.__META__.path, stuck, options);
    return this;
  }
}
