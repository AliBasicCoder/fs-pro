import { FSWatcher } from "fs";
import { File } from "./file";
import { Dir } from "./dir";
import { fsProErr } from "./fsProErr";
import { Model } from "./model";
import { Structure } from "./structure";

export type obj<T> = {
  [key: string]: T;
};

export type objAny = obj<any>;

export interface modelObjBase<T extends string> {
  type: T;
}

export type modelFileObj = modelObjBase<"file"> & {
  ext: string;
  defaultContent?: string | Buffer;
};
export type modelDirObj = modelObjBase<"dir"> & { fileType: modelFileObj };

export interface modelData {
  // __any?: modelFileObj;
  // __any_dir?: modelDirObj;
  [key: string]: modelDirObj | modelFileObj | modelData;
}

export type sw<T extends modelData> = {
  [K in keyof T]: T[K] extends modelFileObj
    ? File
    : T[K] extends modelDirObj
    ? Dir
    : T[K] extends modelData
    ? sw<T[K]>
    : any;
};

export const isModelFileObj = (obj: any): obj is modelFileObj =>
  obj.type === "file";
export const isModelDirObj = (obj: any): obj is modelDirObj =>
  obj.type === "dir";

export interface createOptions {
  /** called when any thing is created wether it's a file or a directory */
  onCreate: (obj: File | Dir) => any;
  /** called when any file is created */
  onCreateFile: (obj: Dir) => any;
  /** called when any directory is created  */
  onCreateDir: (obj: Dir) => any;
}
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
  plugin: (
    | PluginData<"File", File>
    | PluginData<"Dir", Dir>
    | PluginData<"Model", Model>
    | PluginData<"Structure", Structure>
  )[];
}

export interface validateOptions {
  /** called when an invalid file found */
  onInvalidFile: (err: fsProErr, file: File) => any;
  /** called when an invalid directory found */
  onInvalidDir: (err: fsProErr, dir: Dir) => any;
  /** called when an invalid file or directory found */
  onInvalid: (err: fsProErr, fileOrDir: File | Dir) => any;
}

// copied from node-watch https://npmjs.com/package/delete

export type WatchOptions = {
  /**
   * Indicates whether the process should continue to run as long as files are being watched.
   * @default true
   */
  persistent?: boolean;

  /**
   * Indicates whether all subdirectories should be watched, or only the current directory. This applies when a
   * directory is specified, and only on supported platforms.
   *
   * @default false
   */
  recursive?: boolean;

  /**
   * Specifies the character encoding to be used for the filename passed to the listener.
   * @default 'utf8'
   */
  encoding?: string;

  /**
   * Only files which pass this filter (when it returns `true`) will be sent to the listener.
   */
  filter?: RegExp | ((file: string) => boolean);

  /**
   * Delay time of the callback function.
   * @default 200
   */
  delay?: number;
};

export interface ImprovedFSWatcher extends FSWatcher {
  /**
   * Returns `true` if the watcher has been closed.
   */
  isClosed(): boolean;
}
