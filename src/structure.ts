import { modelData, sw, createOptions } from "./types";
import { existsSync } from "fs";
import { create, validate } from "./funcs";

export class Structure {
  public static create(
    path: string,
    stuck: sw<modelData>,
    options?: Partial<createOptions>
  ) {
    create(path, stuck, options);
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
