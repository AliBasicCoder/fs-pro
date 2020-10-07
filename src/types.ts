import type { File } from "./file.ts";
import type { Dir } from "./dir.ts";
import type { fsProErr } from "./fsProErr.ts";

export type FSWatcher = {
  on(event: string, callback: Function): void;
  close(): void;
};

export type Stats = StatsBase<number>;

export type WatchListener = (e: string, path: string) => any;

export type DirForeachOptions = {
  /** if true will loop recursively */
  recursive?: boolean;
};

export type fsObjType = {
  appendFileSync(path: string, data: string | Uint8Array): void;
  copyFileSync(origin: string, dest: string): void;
  // createReadStream: typeof FS.createReadStream;
  // createWriteStream: typeof FS.createWriteStream;
  existsSync(path: string): boolean;
  readFileSync(path: string): BufferType;
  renameSync(oldPath: string, newPath: string): void;
  // unwatchFile: typeof FS.unwatchFile;
  // watchFile: typeof FS.watchFile;
  writeFileSync(path: string, data: string | Uint8Array): void;
  chmodSync(path: string, mode: number | string): void;
  lstatSync(path: string): Stats;
  unlinkSync(path: string): void;
  statSync(path: string): Stats;
  mkdirSync(path: string): void;
  readdirSync(path: string): string[];
  rmdirSync(path: string, options?: { recursive?: boolean }): void;
  mkTempFile: () => string;
  mkTempDir: () => string;
  watch: (path: string) => FSWatcher;
};

export type pathObjType = {
  join(...paths: string[]): string;
  parse(
    p: string
  ): {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
  };
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
  dfCont?: string | BufferType;
  validator?: (this: File) => Error[] | void;
  str: string;
};

export type dirType = {
  __isDir: true;
  str: string;
  fileType: fileType;
};

export const name_sym = Symbol("__name");

export type ShapeObj = {
  [key: string]: ShapeObj | fileType | dirType;
  [name_sym]?: string;
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

// copied from @types/node/fs.d.ts

export interface StatsBase<T> {
  isFile(): boolean;
  isDirectory(): boolean;
  isBlockDevice(): boolean;
  isCharacterDevice(): boolean;
  isSymbolicLink(): boolean;
  isFIFO(): boolean;
  isSocket(): boolean;

  dev: T;
  ino: T;
  mode: T;
  nlink: T;
  uid: T;
  gid: T;
  rdev: T;
  size: T;
  blksize: T;
  blocks: T;
  atimeMs: T;
  mtimeMs: T;
  ctimeMs: T;
  birthtimeMs: T;
  atime: Date;
  mtime: Date;
  ctime: Date;
  birthtime: Date;
}

// copied from https://nest.land/package/node_buffer/files/index.ts (version 1.1.0)

type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Uint8ClampedArray
  | Float32Array
  | Float64Array;

export type BufferConstructor = (length: number) => BufferType;

export interface BufferClass extends BufferConstructor {
  poolSize: number;
  constants: {
    MAX_LENGTH: number;
    MAX_STRING_LENGTH: number;
  };
  from(string: string, encoding?: string): BufferType;
  from(
    arrayBuffer: ArrayBuffer,
    byteOffset?: number,
    length?: number
  ): BufferType;
  from(array: number[]): BufferType;
  from(buffer: BufferType): BufferType;
  alloc(size: number, fill?: ArrayBuffer | Uint8Array | number): BufferType;
  alloc(size: number, fill: string, encoding?: string): BufferType;
  allocUnsafe(size: number): BufferType;
  allocUnsafeSlow(size: number): BufferType;
  isBuffer(buff: any): buff is BufferType;
  byteLength(
    thing:
      | string
      | BufferType
      | TypedArray
      | DataView
      | ArrayBuffer
      | SharedArrayBuffer,
    encoding?: string
  ): number;
  compare(buf1: BufferType, buf2: BufferType): -1 | 0 | 1;
  concat(buffers: BufferType[] | Uint8Array[], totalLen: number): BufferType;
  isEncoding(): boolean;
}

type valueType = string | BufferType | Uint8Array | number;

export interface BufferType extends Uint8Array {
  buffer: ArrayBuffer;
  equals(otherBuffer: BufferType): boolean;

  fill(value: valueType, encoding?: string): this;
  fill(value: valueType, offset?: number, encoding?: string): this;
  fill(value: valueType, offset?: number, end?: number, encoding?: string): this;

  includes(value: valueType, encoding?: string): boolean;
  includes(value: valueType, byteOffset?: number): boolean;
  includes(value: valueType, byteOffset?: number, encoding?: string): boolean;

  indexOf(value: valueType, encoding?: string): number;
  indexOf(value: valueType, byteOffset?: number): number;
  indexOf(value: valueType, byteOffset?: number, encoding?: string): number;

  lastIndexOf(value: valueType, encoding?: string): number;
  lastIndexOf(value: valueType, byteOffset?: number): number;
  lastIndexOf(value: valueType, byteOffset?: number, encoding?: string): number;

  toJSON(): {
    type: "Buffer";
    data: number[];
  };

  toString(encoding?: string, start?: number, end?: number): string;

  write(string: string, encoding?: string): number;
  write(string: string, offset?: number, length?: number): number;
  write(string: string, offset?: number, encoding?: string): number;
  write(string: string, offset?: number, length?: number, encoding?: string): number;

  swap16(): this;
  swap32(): this;
  swap64(): this;
  readInt8(offset?: number): number;
  readUInt8(offset?: number): number;
  readIntBE(offset: number, byteLength: number): number;
  readIntLE(offset: number, byteLength: number): number;
  readInt16BE(offset?: number): number;
  readInt16LE(offset?: number): number;
  readInt32BE(offset?: number): number;
  readInt32LE(offset?: number): number;
  readUIntBE(offset: number, byteLength: number): number;
  readUIntLE(offset: number, byteLength: number): number;
  readUInt16BE(offset?: number): number;
  readUInt16LE(offset?: number): number;
  readUInt32BE(offset?: number): number;
  readUInt32LE(offset?: number): number;
  readBigInt64BE(offset?: number): bigint;
  readBigInt64LE(offset?: number): bigint;
  readBigUInt64BE(offset?: number): bigint;
  readBigUInt64LE(offset?: number): bigint;
  readDoubleBE(offset?: number): number;
  readDoubleLE(offset?: number): number;
  readFloatBE(offset?: number): number;
  readFloatLE(offset?: number): number;
  writeInt8(value: number, offset?: number): number;
  writeUInt8(value: number, offset?: number): number;
  writeIntBE(value: number, offset: number, byteLength: number): number;
  writeIntLE(value: number, offset: number, byteLength: number): number;
  writeInt16BE(value: number, offset?: number): number;
  writeInt16LE(value: number, offset?: number): number;
  writeInt32BE(value: number, offset?: number): number;
  writeInt32LE(value: number, offset?: number): number;
  writeUIntBE(value: number, offset: number, byteLength: number): number;
  writeUIntLE(value: number, offset: number, byteLength: number): number;
  writeUInt16BE(value: number, offset?: number): number;
  writeUInt16LE(value: number, offset?: number): number;
  writeUInt32BE(value: number, offset?: number): number;
  writeUInt32LE(value: number, offset?: number): number;
  writeBigInt64BE(value: bigint, offset?: number): number;
  writeBigInt64LE(value: bigint, offset?: number): number;
  writeBigUInt64BE(value: bigint, offset?: number): number;
  writeBigUInt64LE(value: bigint, offset?: number): number;
  writeDoubleBE(value: number, offset?: number): number;
  writeDoubleLE(value: number, offset?: number): number;
  writeFloatBE(value: number, offset?: number): number;
  writeFloatLE(value: number, offset?: number): number;
}
