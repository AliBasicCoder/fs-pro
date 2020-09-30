import {
  appendFileSync,
  copyFileSync,
  createReadStream,
  createWriteStream,
  existsSync,
  readFileSync,
  renameSync,
  unwatchFile,
  watchFile,
  writeFileSync,
  chmodSync,
  lstatSync,
  unlinkSync,
  statSync,
  tmpFile,
} from "./fs";
import { join, parse } from "./path";
import { obj, Stats } from "./types";
import { fsProErr } from "./fsProErr";

/** the File Class is used to help you work with files */
export class File {
  [Symbol.toStringTag]: string = "File";
  /** the name of the file without the extension */
  name: string;
  /** the extension of the file */
  extension: string;
  /** the name with the extension */
  base: string;
  /** the root of the file */
  root: string;
  /** the path of the file */
  path: string;
  /** the directory of the file */
  directory: string;
  /** the default content of the file written when you call .create() */
  defaultContent?: string | Buffer;
  /** a function to validate the file content */
  validator?: (this: File) => Error[] | void;
  /** the size of the file */
  get size() {
    return this.stat().size;
  }
  /** The timestamp indicating the last time this file was accessed. */
  get lastAccessed() {
    return this.stat().atime;
  }
  /** The timestamp indicating the last time this file was modified. */
  get lastModified() {
    return this.stat().mtime;
  }
  /** The timestamp indicating the last time this file status was changed. */
  get lastChanged() {
    return this.stat().ctime;
  }
  /** The timestamp indicating when the file have been created */
  get createdAt() {
    return this.stat().birthtime;
  }
  /**
   * @NOTE the path you pass will passed to path.join
   * @param args the paths
   * @example
   * const file = new File(__dirname, "./some.txt");
   * file.write("hello world");
   * // ...
   */
  constructor(...args: string[]) {
    this.path = join(...args);
    const { name, ext, dir, base, root } = parse(this.path);
    this.name = name;
    this.base = base;
    this.extension = ext;
    this.directory = dir;
    this.root = root;
    if (existsSync(this.path) && statSync(this.path).isDirectory()) {
      throw new fsProErr("STF", this.path);
    }
  }
  static tmpFile() {
    return new File(tmpFile());
  }
  /**
   * write some data into the file
   * @param data the data to write
   * @NOTE if you pass an object it will be automatically convert to json
   * @example
   * file.write("hello world");
   * file.write(Buffer.from("hello world"));
   * file.write({ hello: "world" });
   */
  write(data: Buffer | string | obj<any>) {
    if (Buffer.isBuffer(data) || typeof data === "string") {
      writeFileSync(this.path, data);
    } else writeFileSync(this.path, JSON.stringify(data));
    return this;
  }
  /**
   * reads the file
   * @example
   * // this will print the line index followed by "| "
   * file.read("\n", (str, i) => console.log(`${i}| ${str}`))
   */
  read(splitter: string, callback: (str: string, index: number) => void): this;
  /**
   * reads the file
   * @example
   * file.read().toString() // => "hello world
   */
  read(): Buffer;
  read(splitter?: string, callback?: (str: string, index: number) => void) {
    if (splitter && callback) {
      this.splitBy(splitter).forEach(callback);
      return this;
    } else return readFileSync(this.path);
  }
  /**
   * append some data to the file
   * @param data data to append
   * @example
   * file.append("hello").append("world").read() // => hello world
   */
  append(data: string | Buffer) {
    appendFileSync(this.path, data);
    return this;
  }
  /**
   * overwrites the file by splitting it's content with the splitter
   * passing the split data into a callback and replacing it with the
   * result
   * @param splitter the string to split the file by
   * @param callback the callback
   * @example
   * file.overwrite("\n", (str, i) => `${i}| ${str}`);
   */
  overwrite(
    splitter: string,
    callback: (str: string, index: number) => string
  ) {
    let res = "";
    this.splitBy(splitter).forEach((str, index) => {
      res += callback(str, index);
    });
    this.write(res);
    return this;
  }
  /**
   * splits the file content and get the item with index
   * passed
   * @param splitter the splitter string
   * @param index the index
   * @example
   * file.getIndex("\n", 24) // gets the line 24
   */
  getIndex(splitter: string, index: number) {
    return this.splitBy(splitter)[index];
  }
  /**
   * splits the file content and get the items between start
   * and end
   * @param splitter the splitter
   * @param start the start index
   * @param end the end index
   * @example
   * file.getIndexBetween("\n", 10, 13) // gets the lines between line 10 and 13 (not including 13)
   */
  getIndexBetween(splitter: string, start: number, end?: number) {
    return this.splitBy(splitter).slice(start, end);
  }
  /**
   * split the file content into an array
   * @param separator the string to split by
   * @param limit A value used to limit the number of elements returned in the array
   * @example
   * // example of getting the lines of a file
   * file.splitBy("\n").forEach(console.log);
   */
  splitBy(separator: string | RegExp, limit?: number) {
    return this.read().toString().split(separator, limit);
  }
  /**
   * creates a read stream for the file
   * @example
   * // example of copying file content via streams
   * fileX.createReadStream().pipe(fileY.createWriteStream());
   */
  createReadStream() {
    return createReadStream(this.path);
  }
  /**
   * creates a write stream for the file
   * @example
   * // example of copying file content via streams:
   * fileX.createReadStream().pipe(fileY.createWriteStream());
   */
  createWriteStream() {
    return createWriteStream(this.path);
  }
  /**
   * reads the file as json
   * @example
   * JsonFile.json() // => { hello: "world" }
   */
  json<T extends obj<any> | any[]>(): T {
    return JSON.parse(this.read().toString());
  }
  /**
   * creates the file
   * @NOTE it won't modify the file content if the file exits and not empty
   */
  create() {
    if (!this.exits()) return this.write(this.defaultContent || "");
    else if (this.size === 0) return this.write(this.defaultContent || "");
    return this;
  }
  /**
   * watches the file
   * @param listener the function the will be called when the file changes
   * @example
   * file.watch(function (e, filename) {
   *    console.log(`the file size is: ${this.size}`);
   * })
   */
  watch(listener: (this: File, curr: Stats, prev: Stats) => any) {
    watchFile(this.path, listener.bind(this));
    return this;
  }
  /** stops watching the file */
  unwatch() {
    unwatchFile(this.path);
    return this;
  }
  /**
   * gets the stats of the file
   * @see https://nodejs.org/api/fs.html#fs_class_fs_stats
   */
  stat() {
    return statSync(this.path);
  }
  /**
   * gets the stats of the file
   * @see https://nodejs.org/api/fs.html#fs_class_fs_stats
   */
  lstat() {
    return lstatSync(this.path);
  }
  /**
   * delete the file
   * @example
   * file.delete();
   * fs.existsSync(file.path) // => false
   */
  delete() {
    unlinkSync(this.path);
  }
  /**
   * copy the file to the destination
   * @param destination the destination to copy the file to
   * @param rename rename the file to another name
   * @param isRelative resolves the destination path based the file path
   * @example
   * // copy to absolute path
   * const newFile = file.copyTo("/home/some_dir");
   * // copy to a path relative to file path
   * const newFile = file.copyTo("../some_dir", null, true);
   * // copy and rename
   * const newFile = file.copyTo("/home/some_dir", "newName.txt");
   * const newFile = file.copyTo("../some_dir", "newName.txt", true);
   *
   * newFile.write("hello world");
   */
  copyTo(destination: string, rename?: null | string, isRelative?: boolean) {
    const dest = isRelative
      ? join(this.directory, destination, rename || this.base)
      : join(destination, rename || this.base);
    copyFileSync(this.path, dest);
    return new File(dest);
  }
  /**
   * moves the file to destination
   * @param destination the destination to copy the file to
   * @param rename rename the file to another name
   * @param isRelative resolves the destination path based the file path
   * @example
   * // move to absolute path
   * file.moveTo("/home/some_dir");
   * // move to a path relative to file path
   * file.moveTo("../some_dir", null, true);
   * // move and rename
   * file.moveTo("/home/some_dir", "newName.txt");
   * file.moveTo("../some_dir", "newName.txt", true);
   *
   * file.write("hello world");
   * // ...
   */
  moveTo(destination: string, rename?: null | string, isRelative?: boolean) {
    const dest = isRelative
      ? join(this.path, destination, rename || "")
      : join(destination, rename || this.base);
    renameSync(this.path, dest);
    const { base, ext, dir, root, name } = parse(dest);
    this.path = dest;
    this.base = base;
    this.extension = ext;
    this.name = name;
    this.root = root;
    this.directory = dir;
    return this;
  }
  /**
   * rename the file
   * @param newName the newName
   * @example
   * file.rename("newName.txt");
   */
  rename(newName: string) {
    const newPath = join(this.directory, newName);
    renameSync(this.path, newPath);
    const { base, name, ext, dir, root } = parse(newPath);
    this.path = newPath;
    this.base = base;
    this.name = name;
    this.directory = dir;
    this.extension = ext;
    this.root = root;
    return this;
  }
  /**
   * changes the mode of the file
   * @param mode the mode
   * @example
   * file.chmod(0o400 + 0o200 + 0o100); // gives the owner read, write and execute permissions
   */
  chmod(mode: number) {
    chmodSync(this.path, mode);
    return this;
  }
  /** returns true if the file exits */
  exits() {
    return existsSync(this.path);
  }
  /**
   * validates the file using the validator
   * @NOTE if an error happens in file.validator file.validate will handel it
   * an return an array of errors
   * @example
   * // validate a json file
   * file.validator = function () {
   *    JSON.parse(this.read.toString())
   * }
   * const errors = file.validate();
   * if (errors.length) console.log("file isn't valid")
   */
  validate(): Error[] {
    if (!this.validator) throw new Error("please set validator first");
    try {
      const errs = this.validator();
      if (!Array.isArray(errs)) return [];
      return errs;
    } catch (error) {
      return [error];
    }
  }
  /**
   * safer from validate (cause it will return true if there's no "validator")
   * @NOTE it will return true if validator property is undefined
   * @example
   * // validate a json file
   * file.validator = function () {
   *    JSON.parse(this.read.toString())
   * }
   * const errors = file.validate();
   * if (errors.length) console.log("file isn't valid")
   */
  valid(): boolean {
    if (!this.validator) return true;
    return this.validate().length === 0;
  }
}
