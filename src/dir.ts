import { existsSync, mkdirSync, readdirSync, renameSync, rmdirSync } from "fs";
import { unlink as unlinkSync } from "./safe/delete";
import { stat as statSync } from "./safe/stat";
import watch from "node-watch";
import { join, parse } from "path";
import { File } from "./file";
// will be replaced with an import from node-watch
import { ImprovedFSWatcher, WatchOptions } from "./types";

export class Dir {
  /** the name of the directory */
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
   * the Dir constructor
   * NOTE: the path you pass will passed to path.join
   * @param args the path
   */
  constructor(...args: string[]) {
    this.path = join(...args);
    const { dir, base, root } = parse(this.path);
    this.name = base;
    this.parentDirectory = dir;
    this.root = root;
    if (existsSync(this.path) && !this.stats().isDirectory())
      throw new Error("Err: path is not directory");
  }
  /**
   * reads the directory
   * example:
   * ```js
   * console.log(dir.read()) // => ["hello_world.txt", "file2.txt"]
   * ```
   */
  read() {
    return readdirSync(this.path);
  }
  /**
   * creates the directory
   * example:
   * ```js
   * dir.create();
   * ```
   */
  create() {
    if (!existsSync(this.path)) mkdirSync(this.path);
    return this;
  }
  /**
   * create a file inside the directory
   * example:
   * ```js
   * const file = dir.createFile("hello_world.txt");
   * file.write("hello world");
   * //...
   * ```
   * @param filename the file you want to create
   */
  createFile(filename: string) {
    return new File(join(this.path, filename)).create();
  }
  /**
   * create a directory inside the directory
   * example:
   * ```js
   * const subDir = dir.createDir("hello");
   * subDir.createFile("hello_world.txt");
   * // ...
   * ```
   * @param dirname the name of the directory
   */
  createDir(dirname: string) {
    return new Dir(join(this.path, dirname)).create();
  }
  /**
   * watches the directory
   * example:
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
  watch(
    listener: (e: "update" | "remove", file: File) => any,
    options?: WatchOptions
  ) {
    this.watcher = watch(this.path, options || {}, (e, filename) =>
      listener(e, new File(join(this.path, filename)))
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
    this.read().forEach(fileOrDir => {
      const pathOfIt = join(this.path, fileOrDir);
      if (statSync(pathOfIt).isDirectory()) new Dir(pathOfIt).delete();
      else unlinkSync(pathOfIt);
    });
    rmdirSync(this.path);
  }
  /**
   * delete every thing (where it's a file or a folder) the matches the regex passed in
   * ```js
   * dir.deleteMatch(/some/); // delete every thing called some
   * ```
   * @param regex the regex
   */
  deleteMath(regex: RegExp) {
    this.read().forEach(fileOrDir => {
      const pathOfIt = join(this.path, fileOrDir);
      const isDir = statSync(pathOfIt).isDirectory();
      if (regex.test(fileOrDir)) {
        if (isDir) new Dir(pathOfIt).delete();
        else unlinkSync(pathOfIt);
      } else if (isDir) {
        new Dir(pathOfIt).deleteMath(regex);
      }
    });
  }
  /**
   * delete every file the matches the regex passed in
   * ```js
   * dir.deleteMatchFile(/.*\.js$/); // delete every js file
   * ```
   * @param regex the regex
   */
  deleteMatchFile(regex: RegExp) {
    this.read().forEach(fileOrDir => {
      const pathOfIt = join(this.path, fileOrDir);
      if (!regex.test(fileOrDir)) return;
      if (statSync(pathOfIt).isDirectory())
        new Dir(pathOfIt).deleteMatchFile(regex);
      else unlinkSync(pathOfIt);
    });
  }
  /**
   * deletes every directory the matches the regex in the dir
   * and sub dir
   * ```js
   * dir.deleteMatchDir(/node_modules/) // delete every node_modules in the dir
   * ```
   * @param regex the regex
   */
  deleteMatchDir(regex: RegExp) {
    this.read().forEach(fileOrDir => {
      const pathOfIt = join(this.path, fileOrDir);
      const isDir = statSync(pathOfIt).isDirectory();
      if (!isDir) return;
      if (regex.test(fileOrDir)) new Dir(pathOfIt).delete();
      else new Dir(pathOfIt).deleteMatchDir(regex);
    });
  }
  /** get the stats of the directory @see https://nodejs.org/api/fs.html#fs_class_fs_stats */
  stats() {
    return statSync(this.path);
  }
  /**
   * rename the directory
   * ```js
   * dir.rename("newName.txt");
   * ```
   * @param newName the newName
   */
  rename(newName: string) {
    const newPath = join(this.parentDirectory, newName);
    renameSync(this.path, newPath);
    const { base, dir, root } = parse(newPath);
    this.path = newPath;
    this.name = base;
    this.parentDirectory = dir;
    this.root = root;
  }
  /** returns true of the file exits */
  exits() {
    return existsSync(this.path);
  }
}
