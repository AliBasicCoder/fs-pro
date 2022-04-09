import {
  appendFileSync,
  copyFileSync,
  existsSync,
  readFileSync,
  renameSync,
  writeFileSync,
  chmodSync,
  lstatSync,
  unlinkSync,
  statSync,
  tmpFile,
  watch,
  openSync,
  closeSync,
  linkSync,
  symlinkSync,
  truncateSync,
} from "./fs.ts";
import { join, parse } from "./path.ts";
import type {
  FSWatcher,
  obj,
  Stats,
  BufferType,
  BufferClass,
  TypedArray,
} from "./types.ts";
import { fsProErr } from "./fsProErr.ts";
import { buffer } from "./buffer.ts";

let Buffer: BufferClass;

buffer.listen((buf) => (Buffer = buf));

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
  defaultContent?: string | BufferType;
  fd?: number;
  /** the fs watcher */
  private watcher?: FSWatcher;
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
   * @example ```js
   * const file = new File(__dirname, "./some.txt");
   * file.write("hello world");
   * // ...
   * ```
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
   * create a file in the tmp directory with a random name
   * very useful for testing
   */
  static tmpFile() {
    return new File(tmpFile());
  }
  /**
   * write some data into the file
   * @param data the data to write
   * @param position Specifies where to begin writing to the file
   * @param length The number of bytes to write
   * @param offset The position in buffer to start writing from it to the file
   * @NOTE if you pass an object it will be automatically convert to json
   * @example ```js
   * // writing strings
   * file.write("hello world");
   * // writing buffer
   * file.write(Buffer.from("hello world"));
   * // writing js object (will be converted to json)
   * file.write({ hello: "world" });
   * // writing from position
   * file.write("hello world");
   * file.write("123", 2);
   * file.read() // => "he123 world"
   * // writing with position and length
   * file.write("hello world");
   * file.write("12345", 2, 3);
   * file.read() // => "he123 world"
   * // writing with position and length and offset
   * file.write("hello world");
   * file.write("12345", 2, 3, 2);
   * file.read() // => "he345 world"
   * ```
   */
  write(
    data: BufferType | string | obj<unknown>,
    position?: number,
    length?: number,
    offset?: number
  ) {
    if (Buffer.isBuffer(data) || typeof data === "string") {
      writeFileSync(this.path, data, position, length, offset);
    } else {
      writeFileSync(this.path, JSON.stringify(data), position, length, offset);
    }
    return this;
  }
  /**
   * reads the file
   * @param position Specifies where to begin reading from in the file
   * @param length The number of bytes to read
   * @param buffer The buffer that the data will be written to
   * @param offset The position in buffer to write the data to
   * @NOTE DO NOT pass buffer or offset on Deno will throw an error if passed
   * @example ```js
   * file.write("hello world");
   * file.read() // => <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
   * // read file starting form index 6
   * file.read(6).toString() // => "world"
   * // read 3 bytes starting from index 6
   * file.read(6, 3).toString() // => "wor"
   * ```
   */
  read(
    position?: number,
    length?: number,
    buffer?: BufferType | TypedArray | DataView,
    offset?: number
  ): BufferType {
    // @ts-ignore: Deno is undefined on node
    if (typeof Deno !== "undefined" && (offset || buffer))
      throw new Error("offset and buffer are NOT ALLOWED on Deno");
    return readFileSync(this.path, position, length, buffer, offset);
  }
  /**
   * reads file as text
   * @param position Specifies where to begin reading from in the file
   * @param length The number of bytes to read
   * @example ```js
   * file.write("hello world");
   * file.text() // => "hello world"
   * // read file as text starting form index 6
   * file.text(6) // => "world"
   * // read 3 bytes as text starting from index 6
   * file.text(6, 3) // => "wor"
   * ```
   */
  text(position?: number, length?: number) {
    return this.read(position, length).toString();
  }
  /**
   * append some data to the file
   * @param data data to append
   * @example ```js
   * file.append("hello").append("world").read() // => hello world
   * ```
   */
  append(data: string | BufferType) {
    appendFileSync(this.path, data);
    return this;
  }
  /**
   * overwrites the file by splitting it's content with the splitter
   * passing the split data into a callback and replacing it with the
   * result
   * @param splitter the string to split the file by
   * @param callback the callback
   * @example ```js
   * file.write("hello\nworld");
   * file.overwrite("\n", (str, i) => `${i}| ${str}`);
   * file.read() // => "0| hello\n1| world"
   * ```
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
   * @example ```js
   * file.write("hello\nworld")
   * file.getIndex("\n", 1) // => "world"
   * ```
   */
  getIndex(splitter: string, index: number) {
    return this.splitBy(splitter)[index];
  }
  /**
   * splits the file content and get the items between start and end (excluding end)
   * @param splitter the splitter
   * @param start the start index
   * @param end the end index
   * @example ```js
   * file.write("hello\nworld\nfoo\nbar")
   * file.getIndexBetween("\n", 0, 3) // => ["hello", "world", "foo"]
   * ```
   */
  getIndexBetween(splitter: string, start: number, end?: number) {
    return this.splitBy(splitter).slice(start, end);
  }
  /**
   * split the file content into an array
   * @param separator the string to split by
   * @param limit A value used to limit the number of elements returned in the array
   * @example ```js
   * file.write("hello\nworld");
   *
   * file.splitBy("\n"); // => ["hello", "world"]
   * ```
   */
  splitBy(separator: string | RegExp, limit?: number) {
    return this.read().toString().split(separator, limit);
  }
  /**
   * reads the file as json
   * @example ```js
   * file.write('{"hello": "world"}')
   * file.json() // => { hello: "world" }
   * ```
   */
  json<T extends obj<unknown> | unknown[]>(): T {
    return JSON.parse(this.read().toString());
  }
  /**
   * creates the file
   * @NOTE defaultContent is written only if the file doesn't exist or file exists and empty
   */
  create() {
    if (!this.exits()) return this.write(this.defaultContent || "");
    else if (this.size === 0) return this.write(this.defaultContent || "");
    return this;
  }
  /**
   * watches the file
   * Notes: in deno stats is always undefined but path is defined
   * @param listener the function the will be called when the file changes
   * @example ```js
   * file.watch(function (e, stat) {
   *    console.log(`the file size is: ${stat.size}`);
   * });
   * ```
   */
  watch(
    listener?: (this: File, e: string, stat?: Stats, path?: string) => void
  ) {
    const listen = (e: string, path?: string, stats?: Stats) => {
      listener?.call(this, e, stats, path);
    };
    this.watcher = watch(this.path, listen);
    // @ts-ignore: Deno is undefined on node
    if (typeof Deno === "undefined") this.watcher.on("all", listen);
    return this;
  }
  /** stops watching the file */
  unwatch() {
    this.watcher?.close();
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
   * @example ```js
   * file.delete();
   * fs.existsSync(file.path) // => false
   * ```
   */
  delete() {
    unlinkSync(this.path);
  }
  /**
   * copy the file to the destination
   * @param destination the destination to copy the file to
   * @param rename rename the file to another name
   * @param isRelative resolves the destination path based the file path
   * @example ```js
   * // copy to absolute path
   * const newFile = file.copyTo("/home/some_dir");
   * // copy to a path relative to file path
   * const newFile = file.copyTo("../some_dir", null, true);
   * // copy and rename
   * const newFile = file.copyTo("/home/some_dir", "newName.txt");
   * const newFile = file.copyTo("../some_dir", "newName.txt", true);
   *
   * newFile.write("hello world");
   * ```
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
   * @example ```js
   * // move to absolute path
   * file.moveTo("/home/some_dir");
   * // move to a path relative to file path
   * file.moveTo("./some_dir", null, true);
   * // move and rename
   * file.moveTo("/home/some_dir", "newName.txt");
   * file.moveTo("./some_dir", "newName.txt", true);
   *
   * file.write("hello world");
   * // ...
   * ```
   */
  moveTo(destination: string, rename?: null | string, isRelative?: boolean) {
    const dest = isRelative
      ? join(this.directory, destination, rename || this.base)
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
   * @example ```js
   * file.rename("newName.txt");
   * ```
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
   * @WARNING chmod does not work on windows on deno and will produce an error
   * @param mode the mode
   * @example ```js
   * file.chmod(0o400 + 0o200 + 0o100); // gives the owner read, write and execute permissions
   * ```
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
   * @example ```js
   * // validate a json file
   * file.validator = function () {
   *    JSON.parse(this.read.toString())
   * }
   * const errors = file.validate();
   * if (errors.length) console.log("file isn't valid")
   * ```
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
   * @example ```js
   * // validate a json file
   * file.validator = function () {
   *    JSON.parse(this.read.toString())
   * }
   * if (!file.valid()) console.log("file isn't valid");
   * ```
   */
  valid(): boolean {
    if (!this.validator) return true;
    return this.validate().length === 0;
  }
  /**
   * opens the file
   * @param flags see https://nodejs.org/api/fs.html#fs_file_system_flags
   */
  open(flags?: string) {
    this.fd = openSync(this.path, flags);
    return this.fd;
  }
  /** closes the file */
  close() {
    if (this.fd) closeSync(this.fd);
    return this;
  }
  /**
   * Creates hard link newPath pointing to file's path
   */
  link(newPath: string) {
    linkSync(this.path, newPath);
    return this;
  }
  /**
   * Creates soft link newPath pointing to file's path
   */
  symlink(newPath: string) {
    symlinkSync(this.path, newPath);
    return this;
  }
  /**
   * clears file starting from index offset (0 by default)
   * @param offset index where to start deleting
   * @example ```js
   * file.write("hello world")
   * file.truncate()
   * file.read() // => ""
   * file.write("hello world")
   * file.truncate(6)
   * file.read() // => "world"
   * ```
   */
  truncate(offset?: number) {
    truncateSync(this.path, offset);
    return this;
  }
}
