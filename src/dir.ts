import { File } from "./file";
import { statSync, mkdirSync, readdirSync, unlinkSync, rmdirSync, existsSync } from "fs";
import watch from "node-watch";
import { parse, join } from "path";
// will be replaced with an import from node-watch
import { ImprovedFSWatcher, WatchOptions } from "./types";

export class Dir {
  /** the name of the directory*/
  name: string;
  /** the root of the file */
  root: string;
  /** the path of the file */
  path: string;
  /** the directory of the file */
  parentDirectory: string;

  private watcher?: ImprovedFSWatcher;
  /** the size of the file */
  get size() {
    return this.stats().size;
  }
  constructor(path: string, isRelative: boolean = true) {
    this.path = isRelative ? join(__dirname, path) : path;
    const { dir, base, root } = parse(this.path);
    this.name = base;
    this.parentDirectory = dir;
    this.root = root;
    if (existsSync(this.path) && !this.stats().isDirectory())
      throw new Error("Err: path is not directory");
  }
  /** reads the directory */
  read() {
    return readdirSync(this.path);
  }
  /** creates the directory */
  create() {
    mkdirSync(this.path);
    return this;
  }
  /**
   * create a file inside the directory
   * ```js
   * const file = dir.createFile("hello_world.txt");
   * file.write("hello world");
   * //...
   * ```
   * @param filename the file you want to create
   */
  createFile(filename: string) {
    return (new File(join(this.path, filename), false)).create();
  }
  /**
   * create a directory inside the directory
   * ```js
   * const subDir = dir.createDir("hello");
   * subDir.createFile("hello_world.txt");
   * // ...
   * ```
   * @param dirname the name of the directory
   */
  createDir(dirname: string) {
    return (new Dir(join(this.path, dirname), false)).create();
  }
  /**
   * watches the directory
   * ```js
   * dir.watch(
   *  (e, file) => {
   *    if(e === "update")
   *      console.log(`file ${file.base} have been updated`);
   *    else
   *      console.log(`file ${file.base} have been removed`);
   *  }
   * )
   * ```
   * @param listener the function will be called when a file changes
   * @param options options
   */
  watch(listener: (e: "update" | "remove", file: File) => any, options?: WatchOptions) {
    this.watcher = watch(
      this.path,
      options || {},
      (e, filename) =>
        listener(e, new File(join(this.path, filename), false))
    );
    return this.watcher;
  }
  /** stops watching the directory */
  unwatch() {
    this.watcher?.close();
    return this;
  }
  /** deletes the directory even if it's not empty */
  delete() {
    this.read().forEach(
      fileOrDir => {
        const pathOfIt = join(this.path, fileOrDir);
        if (statSync(pathOfIt).isDirectory())
          (new Dir(pathOfIt, false)).delete();
        else
          unlinkSync(pathOfIt);
      }
    );
    rmdirSync(this.path);
  }
  /** get the stats of the directory */
  stats() {
    return statSync(this.path);
  }
}
