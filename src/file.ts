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
} from "./fs";
import { Stats } from "fs";
import { join, parse } from "./path";
import { obj } from "./types";
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
  validator?: (this: File, content: any) => (Error | string)[];
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
   * the File constructor
   * NOTE: the path you pass will passed to path.join
   * ```js
   * const file = new File(__dirname, "./some.txt");
   * file.write("hello world");
   * // ...
   * ```
   * @param args the path
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
  /**
   * write some data into the file
   * NOTE: if you pass an object it will be automatically
   * convert to json
   * ```js
   * file.write("hello world");
   * file.write(Buffer.from("hello world"));
   * file.write({ hello: "world" });
   * ```
   * @param data the data to write
   */
  write(data: Buffer | string | obj<any>) {
    if (Buffer.isBuffer(data) || typeof data === "string") {
      writeFileSync(this.path, data);
    } else writeFileSync(this.path, JSON.stringify(data));
    return this;
  }
  /**
   * reads the file
   * example:
   * ```js
   * // this will print the line index followed by "| "
   * file.read("\n", (str, i) => console.log(`${i}| ${str}`))
   * ```
   */
  read(splitter: string, callback: (str: string, index: number) => void): this;
  /**
   * reads the file
   * example:
   * ```js
   * file.read().toString() // => "hello world
   * ```
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
   * example:
   * ```js
   * file.append("hello").append("world").read() // => hello world
   * ```
   * @param data data to append
   */
  append(data: string | Buffer) {
    appendFileSync(this.path, data);
    return this;
  }
  /**
   * overwrites the file by splitting it's
   * content with the splitter
   * ```js
   * file.overwrite("\n", (str, i) => `${i}| ${str}`);
   * ```
   * @param splitter the string to split the file by
   * @param callback the callback
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
   * gets the item by the index
   * ```js
   * file.getIndex("\n", 24) // gets the line 24
   * ```
   * @param splitter the splitter string
   * @param index the index
   */
  getIndex(splitter: string, index: number) {
    return this.splitBy(splitter)[index];
  }
  /**
   * get the index between two numbers
   * ```js
   * file.getIndexBetween("\n", 10, 13) // gets the lines between line 10 and 13 (not including 13)
   * ```
   * @param splitter the splitter
   * @param start the start index
   * @param end the end index
   */
  getIndexBetween(splitter: string, start: number, end?: number) {
    return this.splitBy(splitter).slice(start, end);
  }
  /**
   * split the file content into an array
   * example of getting the lines of a file
   * ```js
   * file.splitBy("\n").forEach(console.log);
   * ```
   * @param separator the string to split by
   * @param limit A value used to limit the number of elements returned in the array
   */
  splitBy(separator: string | RegExp, limit?: number) {
    return this.read().toString().split(separator, limit);
  }
  /**
   * creates a read stream for the file
   * example of copying file content via streams:
   * ```js
   * fileX.createReadStream().pipe(fileY.createWriteStream());
   * ```
   */
  createReadStream() {
    return createReadStream(this.path);
  }
  /**
   * creates a write stream for the file
   * example of copying file content via streams:
   * ```js
   * fileX.createReadStream().pipe(fileY.createWriteStream());
   * ```
   */
  createWriteStream() {
    return createWriteStream(this.path);
  }
  /**
   * reads the file as json
   * example:
   * ```js
   * JsonFile.json() // => { hello: "world" }
   * ```
   */
  json<T extends obj<any> | any[]>(): T {
    return JSON.parse(this.read().toString());
  }
  /**
   * creates the file
   * NOTE: it won't modify the file content if the file exits and not empty and will write
   * the defaultContent property if exits
   */
  create() {
    if (!this.exits()) return this.write(this.defaultContent || "");
    else if (this.size === 0) return this.write(this.defaultContent || "");
    else return this;
  }
  /**
   * watches the file
   * ```js
   * file.watch(function (e, filename) {
   *    console.log(`the file size is: ${this.size}`);
   * })
   * ```
   * @param listener the function the will be called when the file changes
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
  /** gets the stats of the file @see https://nodejs.org/api/fs.html#fs_class_fs_stats */
  stat() {
    return statSync(this.path);
  }
  /** gets the stats of the file @see https://nodejs.org/api/fs.html#fs_class_fs_stats */
  lstat() {
    return lstatSync(this.path);
  }
  /**
   * delete the file
   * ```js
   * file.delete();
   * fs.existsSync(file.path) // => false
   * ```
   */
  delete() {
    unlinkSync(this.path);
  }
  /**
   * copy the file to the destination
   * example:
   * ```js
   * const newFile = file.copyTo(`some_dir/${file.base}`);
   * newFile.write("hello world");
   * // ...
   * ```
   * @param destination the destination to copy the file to
   * @param isRelative tells the function if the path is relative or not
   */
  copyTo(destination: string) {
    const dest = join(this.directory, destination);
    copyFileSync(this.path, dest);
    return new File(dest);
  }
  /**
   * moves the file to destination
   * example:
   * ```js
   * file.moveTo("some_dir");
   * file.write("hello world");
   * // ...
   * ```
   * @param destination the destination to copy the file to
   * @param isRelative tells the function if the path is relative or not
   */
  moveTo(destination: string) {
    const dest = join(destination, this.base);
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
   * ```js
   * file.rename("newName.txt");
   * ```
   * @param newName the newName
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
  }
  /**
   * changes the mode of the file
   * ```js
   * file.chmod(0o400 + 0o200 + 0o100); // gives the owner read, write and execute permissions
   * ```
   * @param mode the mode
   */
  chmod(mode: number) {
    chmodSync(this.path, mode);
  }
  /** returns true if the file exits */
  exits() {
    return existsSync(this.path);
  }
  /**
   * validates the file using the validator
   * ```js
   * // validate a json file
   * file.validator = str => JSON.parse(str);
   * const errors = file.validate();
   * if (errors.length) console.log("file isn't valid")
   * ```
   */
  validate(): string[] {
    if (!this.validator) throw new Error("please set validator first");
    try {
      const errs = this.validator(this.read().toString());
      if (!Array.isArray(errs)) return [];
      return errs.map((err) => (typeof err === "string" ? err : err.message));
    } catch (error) {
      return [error];
    }
  }
  /**
   * safer from validate and returns just a boolean
   *
   * NOTE: it will return true if validator property is undefined
   * ```js
   * file.validator = str => JSON.parse(str);
   * if (!file.valid()) console.log("file isn't valid");
   * ```
   */
  valid(): boolean {
    if (!this.validator) return true;
    return this.validate().length === 0;
  }
}
