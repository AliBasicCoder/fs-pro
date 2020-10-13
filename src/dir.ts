import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmdirSync,
  lstatSync,
  unlinkSync,
  statSync,
  watch,
  tmpDir,
} from "./fs.ts";
import { join, parse } from "./path.ts";
import { File } from "./file.ts";
import type {
  DirForeachOptions,
  FSWatcher,
  WatchListener,
  obj,
} from "./types.ts";
import { fsProErr } from "./fsProErr.ts";

/** the Dir Class is used to help you work with files */
export class Dir<T extends obj<Function> = {}> {
  [Symbol.toStringTag]: string = "Dir";
  /** the name of the directory */
  name: string;
  /** the root of the file */
  root: string;
  /** the path of the file */
  path: string;
  /** the directory of the file */
  parentDirectory: string;

  private watcher?: FSWatcher;
  /**
   * added is way for access methods added by plugins with typing
   * @example ``js
   * // let's assume that there a method called "hi" added by a plugin
   * const dir = new Dir<{
   *  hi: () => void
   * }>("my_dir");
   * dir.added.hi();
   * ``
   */
  get added(): T {
    // @ts-ignore
    return Dir.prototype;
  }
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
   * the Dir Class constructor
   */
  constructor(...args: string[]) {
    this.path = join(...args);
    const { dir, base, root } = parse(this.path);
    this.name = base;
    this.parentDirectory = dir;
    this.root = root;
    if (existsSync(this.path) && !this.stat().isDirectory()) {
      throw new fsProErr("STD", this.path);
    }
  }
  /**
   * create a dir in the tmp directory
   * @example ```js
   * const dir = Dir.tmpDir();
   * console.log(dir.path) // => "'/tmp/tmp-132576-Rlxque0XmU45'"
   * ```
   */
  static tmpDir() {
    return new Dir(tmpDir());
  }
  /**
   * reads the directory
   * @example ```js
   * console.log(dir.read()) // => ["hello_world.txt", "file2.txt"]
   * ```
   */
  read() {
    return readdirSync(this.path);
  }
  /**
   * reads te directory and convert it to File and Dir objects
   * @example ```js
   * dir.readResolve().forEach(console.log);
   * ```
   */
  readResolve() {
    return this.read().map((path) => {
      const neededPath = join(this.path, path);
      if (statSync(neededPath).isDirectory()) return new Dir(neededPath);
      else return new File(neededPath);
    });
  }
  /**
   * loops through every thing inside the directory
   * @param callback the callback
   * @param options options
   * @example ```js
   * // console logs every thing's path (file or dir)
   * dir.forEach(thing => console.log(thing.path));
   * // console logs every thing's path (file or dir) recursively
   * dir.forEach(thing => console.log(thing.path), { recursive: true });
   * ```
   */
  forEach(
    callback: (fileOrDir: File | Dir) => any,
    options: DirForeachOptions = {}
  ) {
    this.readResolve().forEach((thing) => {
      callback(thing);
      if (thing instanceof Dir && options.recursive)
        thing.forEach(callback, options);
    });
    return this;
  }
  /**
   * loops through every file inside the directory
   * @param callback the callback
   * @param options options
   * @example ```js
   * // console logs every file's path
   * dir.forEachFile(file => console.log(file.path));
   * // console logs every file's path
   * dir.forEachFile(file => console.log(file.path), { recursive: true });
   * ```
   */
  forEachFile(callback: (file: File) => any, options: DirForeachOptions = {}) {
    this.readResolve().forEach((thing) => {
      if (thing instanceof File) callback(thing);
      if (thing instanceof Dir && options.recursive)
        thing.forEachFile(callback, options);
    });
    return this;
  }
  /**
   * loops through every directory inside the directory
   * @param callback the callback
   * @param options options
   * @example ```js
   * // console logs every directory's path
   * dir.forEachDir(dir => console.log(dir.path))
   * // console logs every directory's path
   * dir.forEachDir(dir => console.log(dir.path), { recursive: true })
   * ```
   */
  forEachDir(callback: (dir: Dir) => any, options: DirForeachOptions = {}) {
    this.readResolve().forEach((thing) => {
      if (thing instanceof Dir) {
        callback(thing);
        if (options.recursive) thing.forEachDir(callback, options);
      }
    });
    return this;
  }
  /**
   * creates the directory (if it doesn't exits)
   * @example ```js
   * dir.create();
   * ```
   */
  create() {
    if (!existsSync(this.path)) mkdirSync(this.path);
    return this;
  }
  /**
   * create a file inside the directory
   * @param filename the file you want to create
   * @param createParents create parent directories if doesn't exits
   * @NOTE use ONLY forward slash of filename
   * @example ```js
   * const file = dir.createFile("hello_world.txt");
   * file.write("hello world");
   * // ...
   * const file2 = dir.createFile("some_dir/hello_world.txt", true);
   * file2.write("hello world");
   * //...
   * ```
   */
  createFile(filename: string, createParents?: boolean) {
    if (createParents) {
      const parentsArr = filename.split("/");
      parentsArr.forEach((dir, i) =>
        i !== parentsArr.length - 1
          ? new Dir(this.path, ...parentsArr.slice(0, i), dir).create()
          : null
      );
    }
    return new File(join(this.path, filename)).create();
  }
  /**
   * create a directory inside the directory
   * @param dirname the name of the directory
   * @param createParents create parent directories if doesn't exits
   * @example ```js
   * const subDir = dir.createDir("hello");
   * subDir.createFile("hello_world.txt");
   * // ...
   * const subDir2 = dir.createDir("foo/bar/hello", true);
   * subDir2.createFile("hello_world.txt");
   * // ...
   * ```
   */
  createDir(dirname: string, createParents?: boolean) {
    if (createParents) {
      const parentsArr = dirname.split("/");
      parentsArr.forEach((dir, i) =>
        i !== parentsArr.length - 1
          ? new Dir(this.path, ...parentsArr.slice(0, i), dir).create()
          : null
      );
    }
    return new Dir(this.path, dirname).create();
  }
  /**
   * watches the directory
   * @param maybeListener the function will be called when a file changes
   * @example ```js
   * dir.watch({}, (e, path) => {
   *    if (e === "update") console.log(`${path} have been updated`);
   *    if(e === "remove") console.log(`${path} have been removed`);
   * })
   * ```
   */
  watch(listener?: WatchListener) {
    this.watcher = watch(this.path);
    if (listener) {
      // @ts-ignore
      if (typeof Deno === "undefined") this.watcher.on("all", listener);
      else this.watcher.on("change", listener);
    }
    return this.watcher;
  }
  /** stops watching the directory */
  unwatch() {
    this.watcher?.close();
    return this;
  }
  /** deletes the directory even if it's not empty */
  delete() {
    rmdirSync(this.path, { recursive: true });
    return this;
  }
  /**
   * delete every thing (where it's a file or a folder) that matches the regex passed in
   * @param regex the regex
   * @example ```js
   * dir.deleteMatch(/some/); // delete every thing called some
   * ```
   */
  deleteMath(regex: RegExp) {
    this.read().forEach((fileOrDir) => {
      const pathOfIt = join(this.path, fileOrDir);
      const isDir = statSync(pathOfIt).isDirectory();
      if (regex.test(fileOrDir)) {
        if (isDir) new Dir(pathOfIt).delete();
        else unlinkSync(pathOfIt);
      } else if (isDir) {
        new Dir(pathOfIt).deleteMath(regex);
      }
    });
    return this;
  }
  /**
   * delete every file the matches the regex passed in
   * @param regex the regex
   * @example ```js
   * dir.deleteMatchFile(/.*\.js$/); // delete every js file
   * ```
   */
  deleteMatchFile(regex: RegExp) {
    this.read().forEach((fileOrDir) => {
      const pathOfIt = join(this.path, fileOrDir);
      if (!regex.test(fileOrDir)) return;
      if (statSync(pathOfIt).isDirectory()) {
        new Dir(pathOfIt).deleteMatchFile(regex);
      } else unlinkSync(pathOfIt);
    });
    return this;
  }
  /**
   * deletes every directory the matches the regex in the dir and sub dir
   * @param regex the regex
   * @example ```js
   * dir.deleteMatchDir(/node_modules/) // delete every node_modules in the dir
   * ```
   */
  deleteMatchDir(regex: RegExp) {
    this.read().forEach((fileOrDir) => {
      const pathOfIt = join(this.path, fileOrDir);
      const isDir = statSync(pathOfIt).isDirectory();
      if (!isDir) return;
      if (regex.test(fileOrDir)) new Dir(pathOfIt).delete();
      else new Dir(pathOfIt).deleteMatchDir(regex);
    });
    return this;
  }
  /**
   * get the stats of the directory
   * @see https://nodejs.org/api/fs.html#fs_class_fs_stats
   */
  stat() {
    return statSync(this.path);
  }
  /**
   * get the stats of the directory
   * @see https://nodejs.org/api/fs.html#fs_class_fs_stats
   */
  lstat() {
    return lstatSync(this.path);
  }
  /**
   * rename the directory
   * @param newName the newName
   * @example ```js
   * dir.rename("newName");
   * ```
   */
  rename(newName: string) {
    const newPath = join(this.parentDirectory, newName);
    renameSync(this.path, newPath);
    const { base, dir, root } = parse(newPath);
    this.path = newPath;
    this.name = base;
    this.parentDirectory = dir;
    this.root = root;
    return this;
  }
  /** returns true if the directory exits */
  exits() {
    return existsSync(this.path);
  }
  /**
   * gets a file inside the directory
   * @example ```js
   * myDir.getFile("myFile.txt").read() //...
   * ```
   */
  getFile(path: string) {
    return new File(this.path, path);
  }
  /**
   * gets a folder inside the directory
   * @example ```js
   * myDir.getDir("myChildDir").read() //...
   * ```
   */
  getDir(path: string) {
    return new Dir(this.path, path);
  }
  /**
   * copy the directory to another location
   * @param destination the destination folder
   * @param rename rename the folder copy
   * @param isRelative if true resolves the destination path based on the dir path
   * @example ```js
   * // copy directory to "/home/some_dir"
   * dir.copyTo("/home/some_dir")
   * // copy directory to "/home/some_dir" an rename the directory's copy name to "new-name"
   * dir.copyTo("/home/some_dir", "new_name")
   * // copy directory to "../some_dir" (path is resolved passed on folder's location)
   * dir.copyTo("../some_dir", null, true)
   * ```
   */
  copyTo(destination: string, rename?: null | string, isRelative?: boolean) {
    const dest = isRelative
      ? join(this.path, destination, rename || this.name)
      : join(destination, rename || this.name);
    mkdirSync(dest);
    this.forEach((fileOrDir) => fileOrDir.copyTo(dest));
    return new Dir(dest);
  }
  /**
   * move the directory to another location
   * @param destination the destination folder
   * @param rename rename the folder
   * @param isRelative if true resolves the destination path based on the dir path
   * @example ```js
   * // move directory to "/home/some_dir"
   * dir.moveTo("/home/some_dir")
   * // move directory to "/home/some_dir" an rename the directory to "new-name"
   * dir.moveTo("/home/some_dir", "new_name")
   * // move directory to "../some_dir" (path is resolved passed on folder's location)
   * dir.moveTo("../some_dir", null, true)
   * ```
   */
  moveTo(destination: string, rename?: null | string, isRelative?: boolean) {
    const dest = isRelative
      ? join(this.path, destination, rename || this.name)
      : join(destination, rename || this.name);
    mkdirSync(dest);
    this.forEach((fileOrDir) => fileOrDir.moveTo(dest));
    rmdirSync(this.path);
    const parsedPath = parse(dest);
    this.path = dest;
    this.name = parsedPath.base;
    this.root = parsedPath.root;
    return this;
  }
}
