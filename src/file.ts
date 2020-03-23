import {
  appendFileSync,
  copyFileSync,
  createReadStream,
  createWriteStream,
  existsSync,
  readFileSync,
  renameSync,
  Stats,
  unwatchFile,
  watchFile,
  writeFileSync,
  chmodSync
} from "fs";
import { unlink as unlinkSync } from "./safe/delete";
import { stat as statSync } from "./safe/stat";
import { join, parse } from "path";
import { obj } from "./types";

/** the File Class is used to help you work with files */
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
  /** the default content of the file written when you call .create() */
  defaultContent?: string | Buffer;
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
   * @param separator the string to split by
   * @param limit A value used to limit the number of elements returned in the array
   */
  splitBy(separator: string | RegExp, limit?: number) {
    return this.read()
      .toString()
      .split(separator, limit);
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
  /**
   * creates the file
   * NOTE: it won't modify the file content if the file exits and will write
   * the defaultContent property if exits
   */
  create() {
    if (!existsSync(this.path)) return this.write(this.defaultContent || "");
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
  copyTo(destination: string) {
    const dest = join(this.directory, destination);
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
}
