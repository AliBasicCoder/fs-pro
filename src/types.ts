import { FSWatcher } from "fs";
import { File } from "./file";
import { Dir } from "./dir";

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
