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
} from "./fs";
import { join, parse } from "./path";
import { File } from "./file";
// will be replaced with an import from node-watch
import { WatchOptions, DirForeachOptions, FSWatcher } from "./types";
import { fsProErr } from "./fsProErr";

/** the Dir Class is used to help you work with files */
export class Dir {
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
  static tmpDir() {
    return new Dir(tmpDir());
  }
  /**
   * reads the directory
   * @example
   * console.log(dir.read()) // => ["hello_world.txt", "file2.txt"]
   */
  read() {
    return readdirSync(this.path);
  }
  /**
   * reads te directory and convert it to File an Dir objects
   * @example
   * dir.readResolve().forEach(console.log);
   */
  readResolve() {
    return this.read().map((path) => {
      const neededPath = join(this.path, path);
      if (statSync(neededPath).isDirectory()) return new Dir(neededPath);
      else return new File(neededPath);
    });
  }
  /**
   * loops throw every thing inside the directory
   * @param callback the callback
   * @param options options
   * @example
   * // console logs every thing's path (file or dir)
   * dir.forEach(thing => console.log(thing.path));
   * // console logs every thing's path (file or dir) recursively
   * dir.forEach(thing => console.log(thing.path), { recursive: true });
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
  }
  /**
   * loops throw every file inside the directory
   * @param callback the callback
   * @param options options
   * @example
   * // console logs every file's path
   * dir.forEachFile(file => console.log(file.path))
   * // console logs every file's path
   * dir.forEachFile(file => console.log(file.path), { recursive: true })
   */
  forEachFile(callback: (file: File) => any, options: DirForeachOptions = {}) {
    this.readResolve().forEach((thing) => {
      if (thing instanceof File) callback(thing);
      if (thing instanceof Dir && options.recursive)
        thing.forEachFile(callback, options);
    });
  }
  /**
   * loops throw every directory inside the directory
   * @param callback the callback
   * @param options options
   * @example
   * // console logs every directory's path
   * dir.forEachDir(dir => console.log(dir.path))
   * // console logs every directory's path
   * dir.forEachDir(dir => console.log(dir.path), { recursive: true })
   */
  forEachDir(callback: (dir: Dir) => any, options: DirForeachOptions = {}) {
    this.readResolve().forEach((thing) => {
      if (thing instanceof Dir) {
        callback(thing);
        if (options.recursive) thing.forEachDir(callback, options);
      }
    });
  }
  /**
   * creates the directory (if it doesn't exits)
   * @example
   * dir.create();
   */
  create() {
    if (!existsSync(this.path)) mkdirSync(this.path);
    return this;
  }
  /**
   * create a file inside the directory
   * @param filename the file you want to create
   * @example
   * const file = dir.createFile("hello_world.txt");
   * file.write("hello world");
   * //...
   */
  createFile(filename: string) {
    return new File(join(this.path, filename)).create();
  }
  /**
   * create a directory inside the directory
   * @param dirname the name of the directory
   * @example
   * const subDir = dir.createDir("hello");
   * subDir.createFile("hello_world.txt");
   * // ...
   */
  createDir(dirname: string) {
    return new Dir(this.path, dirname).create();
  }
  /**
   * watches the directory
   * @param listener the function will be called when a file changes
   * @param options options
   * @example
   * dir.watch((e, file) => {
   *    if (e === "update") console.log(`file ${file.base} have been updated`);
   *    else console.log(`file ${file.base} have been removed`);
   * })
   */
  watch(listener: (e: string, file: File) => any, options?: WatchOptions) {
    this.watcher = watch(this.path, options || {}, (e, filename) =>
      // @ts-ignore
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
    this.read().forEach((fileOrDir) => {
      const pathOfIt = join(this.path, fileOrDir);
      if (statSync(pathOfIt).isDirectory()) new Dir(pathOfIt).delete();
      else unlinkSync(pathOfIt);
    });
    rmdirSync(this.path);
  }
  /**
   * delete every thing (where it's a file or a folder) that matches the regex passed in
   * @param regex the regex
   * @example
   * dir.deleteMatch(/some/); // delete every thing called some
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
  }
  /**
   * delete every file the matches the regex passed in
   * @param regex the regex
   * @example
   * dir.deleteMatchFile(/.*\.js$/); // delete every js file
   */
  deleteMatchFile(regex: RegExp) {
    this.read().forEach((fileOrDir) => {
      const pathOfIt = join(this.path, fileOrDir);
      if (!regex.test(fileOrDir)) return;
      if (statSync(pathOfIt).isDirectory()) {
        new Dir(pathOfIt).deleteMatchFile(regex);
      } else unlinkSync(pathOfIt);
    });
  }
  /**
   * deletes every directory the matches the regex in the dir and sub dir
   * @param regex the regex
   * @example
   * dir.deleteMatchDir(/node_modules/) // delete every node_modules in the dir
   */
  deleteMatchDir(regex: RegExp) {
    this.read().forEach((fileOrDir) => {
      const pathOfIt = join(this.path, fileOrDir);
      const isDir = statSync(pathOfIt).isDirectory();
      if (!isDir) return;
      if (regex.test(fileOrDir)) new Dir(pathOfIt).delete();
      else new Dir(pathOfIt).deleteMatchDir(regex);
    });
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
   * @example
   * dir.rename("newName");
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
  /** returns true if the directory exits */
  exits() {
    return existsSync(this.path);
  }
  /**
   * gets a file inside the directory
   * @example
   * myDir.getFile("myFile.txt").read() //...
   */
  getFile(path: string) {
    return new File(this.path, path);
  }
  /**
   * gets a folder inside the directory
   * @example
   * myDir.getDir("myChildDir").read() //...
   */
  getDir(path: string) {
    return new Dir(this.path, path);
  }
}
