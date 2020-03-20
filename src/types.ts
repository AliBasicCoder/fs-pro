import { FSWatcher } from "fs";

export type obj<T> = {
  [key: string]: T;
};

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
