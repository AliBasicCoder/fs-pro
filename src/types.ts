import * as FS from "fs";
import { Stats, BigIntOptions, PathLike, BigIntStats, StatOptions } from "fs";
import * as PATH from "path";
import { File } from "./file";
import { Dir } from "./dir";
import { fsProErr } from "./fsProErr";
import { FSWatcher, WatchOptions } from "chokidar";

export {
  FSWatcher,
  Stats,
  BigIntOptions,
  PathLike,
  BigIntStats,
  StatOptions,
  WatchOptions,
};

export type DirForeachOptions = {
  /** if true will loop recursively */
  recursive?: boolean;
};

export type fsObjType = {
  appendFileSync: typeof FS.appendFileSync;
  copyFileSync: typeof FS.copyFileSync;
  createReadStream: typeof FS.createReadStream;
  createWriteStream: typeof FS.createWriteStream;
  existsSync: typeof FS.existsSync;
  readFileSync: typeof FS.readFileSync;
  renameSync: typeof FS.renameSync;
  unwatchFile: typeof FS.unwatchFile;
  watchFile: typeof FS.watchFile;
  writeFileSync: typeof FS.writeFileSync;
  chmodSync: typeof FS.chmodSync;
  lstatSync: typeof FS.lstatSync;
  unlinkSync: typeof FS.unlinkSync;
  statSync: typeof FS.statSync;
  mkdirSync: typeof FS.mkdirSync;
  readdirSync: typeof FS.readdirSync;
  rmdirSync: typeof FS.rmdirSync;
  mkTempFile: () => string;
  mkTempDir: () => string;
  // watcher must follow node-watch api
  watch: (path: string, options: WatchOptions) => FSWatcher;
};

export type pathObjType = {
  join: typeof PATH.join;
  parse: typeof PATH.parse;
};

export type obj<T> = {
  [key: string]: T;
};

export type objAny = obj<any>;

/**
 * @param A the className
 * @param B the actual class type
 */
export interface PluginData<A, B> {
  /** the name of the method */
  methodName: string;
  /** if true will add the method to the static ones */
  isStatic: boolean;
  /** the class to add to it */
  className: A;
  /** the actual method (use the function keyword) */
  func: (this: B, ...args: any[]) => any;
}
/** the Plugin interface */
export interface Plugin {
  /** the name of the plugin */
  name: string;
  /** any required plugins (will be loaded by order passed) */
  requires?: Plugin[];
  /** the actual plugin */
  plugin: (PluginData<"File", File> | PluginData<"Dir", Dir>)[];
}

export interface validateOptions {
  /** called when an invalid file found */
  onInvalidFile: (err: fsProErr, file: File) => any;
  /** called when an invalid directory found */
  onInvalidDir: (err: fsProErr, dir: Dir) => any;
  /** called when an invalid file or directory found */
  onInvalid: (err: fsProErr, fileOrDir: File | Dir) => any;
}

// for Shape

export type fileType = {
  __isFile: true;
  dfCont?: string | Buffer;
  validator?: (this: File) => Error[] | void;
  str: string;
};

export type dirType = {
  __isDir: true;
  str: string;
  fileType: fileType;
};

export type ShapeObj = { [key: string]: ShapeObj | fileType | dirType } & {
  __rest?: ShapeObj | fileType | dirType;
  __name?: string;
};

export type ShapeObjWithoutName = {
  [key: string]: ShapeObj | fileType | dirType;
} & {
  __rest?: ShapeObj | fileType | dirType;
};

export const isFileType = (obj: any): obj is fileType => obj.__isFile === true;

export const isDirType = (obj: any): obj is dirType => obj.__isDir === true;

export type createEvents = {
  onCreate?: (thing: File | Dir) => any;
  onCreateFile?: (file: File) => any;
  onCreateDir?: (thing: Dir) => any;
};

export type errArr = {
  arr: fsProErr[];
  push: (err?: fsProErr | errArr) => void;
};

export const isErrArr = (obj?: any): obj is errArr => obj.arr && obj.push;
