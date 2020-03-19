import { join, parse } from "path";
import {
  writeFileSync,
  readFileSync,
  createReadStream,
  createWriteStream,
  statSync,
  watchFile,
  Stats,
  unwatchFile,
  unlinkSync,
  existsSync,
  copyFileSync,
  appendFileSync
} from "fs";
import { obj } from "./types";

export class File {
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
  /** the size of the file */
  get size() {
    return this.stats().size;
  }
  /** The timestamp indicating the last time this file was accessed. */
  get lastAccessed() {
    return this.stats().atime;
  }
  /** The timestamp indicating the last time this file was modified. */
  get lastModified() {
    return this.stats().mtime;
  }
  /** The timestamp indicating the last time this file status was changed. */
  get lastChanged() {
    return this.stats().ctime;
  }
  /** The timestamp indicating when the file have been created */
  get createdAt() {
    return this.stats().birthtime;
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
    if (existsSync(this.path) && this.stats().isDirectory())
      throw new Error("Err: path is not file");
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
    if (Buffer.isBuffer(data) || typeof data === "string")
      writeFileSync(this.path, data);
    else writeFileSync(this.path, JSON.stringify(data));
    return this;
  }
  /**
   * reads the file
   * example:
   * ```js
   * file.read().toString() // => "hello world"
   * ```
   */
  read() {
    return readFileSync(this.path);
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
   * split the file content into an array
   * example of getting the lines of a file
   * ```js
   * file.splitBy("\n").forEach(console.log);
   * ```
   * @param splitter the string to split by
   */
  splitBy(splitter: string) {
    return this.read()
      .toString()
      .split(splitter);
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
  json() {
    return JSON.parse(this.read().toString());
  }
  /** creates the file */
  create() {
    return this.write("");
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
  stats() {
    return statSync(this.path);
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
   * const newFile = file.copyTo("./some_dir");
   * newFile.write("hello world");
   * // ...
   * ```
   * @param destination the destination to copy the file to
   * @param isRelative tells the function if the path is relative or not
   */
  copyTo(destination: string, isRelative: boolean = true) {
    const dest = isRelative ? join(__dirname, destination) : destination;
    copyFileSync(this.path, dest);
    return new File(dest);
  }
  /**
   * moves the file to destination
   * example:
   * ```js
   * file.moveTo("./newFile.txt");
   * file.write("hello world");
   * // ...
   * ```
   * @param destination the destination to copy the file to
   * @param isRelative tells the function if the path is relative or not
   */
  moveTo(destination: string, isRelative: boolean = true) {
    const dest = isRelative ? join(__dirname, destination) : destination;
    const newFile = this.copyTo(dest, false);
    this.delete();
    this.path = newFile.path;
    this.base = newFile.base;
    this.extension = newFile.extension;
    this.name = newFile.name;
    this.root = newFile.root;
    this.directory = newFile.directory;
    return this;
  }
}
