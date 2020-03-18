import { join, parse } from "path";
import { writeFileSync, readFileSync, createReadStream, createWriteStream, statSync, watchFile, Stats, unwatchFile, unlinkSync, existsSync } from "fs";
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
  constructor(path: string, isRelative: boolean = true) {
    this.path = isRelative ? join(__dirname, path) : path;
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
    else
      writeFileSync(this.path, JSON.stringify(data));
    return this;
  }
  /** read the file */
  read() {
    return readFileSync(this.path);
  }
  /** create a read stream for the file */
  createReadStream() {
    return createReadStream(this.path);
  }
  /** create a write stream for the file */
  createWriteStream() {
    return createWriteStream(this.path);
  }
  /** read the file as json */
  json() {
    return JSON.parse(this.read().toString());
  }
  /** create the file */
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
  /** gets the stats of the file */
  stats() {
    return statSync(this.path);
  }
  /** delete the file */
  delete() {
    unlinkSync(this.path);
  }
}
