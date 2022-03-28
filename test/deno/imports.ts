interface Test {
  name: string;
  fn: Function;
  ignore?: boolean;
}

export const tests: Test[] = [];

export const platform =
  // @ts-ignore
  typeof Deno === "undefined" ? "node" : "deno";

export function test(obj: Test) {
  tests.push(obj);
}

let imports: {
  assertEquals(actual: unknown, expected: unknown, msg?: string): void;
  assert(expr: unknown, msg?: string): void;
  assertThrows(fn: Function): void;
  makeTempDirSync(): string;
  makeTempFileSync(): string;
  parse(path: string): ParsedPath;
  join(...path: string[]): string;
  existsSync(path: string): boolean;
  statSync(path: string): Stats;
  readTextFileSync(path: string): string;
  writeTextFileSync(path: string, data: string): void;
  resources(): ResourceMap;
  tempDir(): string;
};

export function setImports(i: typeof imports) {
  imports = i;
}

export function getImports() {
  return imports;
}

export const assertEquals: typeof imports["assertEquals"] = (...args) =>
  imports.assertEquals(...args);

export const assert: typeof imports["assert"] = (...args) =>
  imports.assert(...args);
export const assertThrows: typeof imports["assertThrows"] = (...args) =>
  imports.assertThrows(...args);

export const makeTempDirSync: typeof imports["makeTempDirSync"] = (...args) =>
  imports.makeTempDirSync(...args);

export const makeTempFileSync: typeof imports["makeTempFileSync"] = (...args) =>
  imports.makeTempFileSync(...args);

export const parse: typeof imports["parse"] = (...args) =>
  imports.parse(...args);

export const join: typeof imports["join"] = (...args) => imports.join(...args);

export const existsSync: typeof imports["existsSync"] = (...args) =>
  imports.existsSync(...args);

export const statSync: typeof imports["statSync"] = (...args) =>
  imports.statSync(...args);

export const readTextFileSync: typeof imports["readTextFileSync"] = (...args) =>
  imports.readTextFileSync(...args);

export const writeTextFileSync: typeof imports["writeTextFileSync"] = (
  ...args
) => imports.writeTextFileSync(...args);

export const resources: typeof imports["resources"] = () => {
  if (platform === "node")
    throw new Error("this function should not be called in node");
  return imports.resources();
};

export const tempDir: typeof imports["tempDir"] = (...args) =>
  imports.tempDir(...args);

// from std deno

type Stats = {
  /** ID of the device containing the file.
   *
   * _Linux/Mac OS only._ */
  dev: number | null;
  /** Inode number.
   *
   * _Linux/Mac OS only._ */
  ino: number | null;
  /** **UNSTABLE**: Match behavior with Go on Windows for `mode`.
   *
   * The underlying raw `st_mode` bits that contain the standard Unix
   * permissions for this file/directory. */
  mode: number | null;
  /** Number of hard links pointing to this file.
   *
   * _Linux/Mac OS only._ */
  nlink: number | null;
  /** User ID of the owner of this file.
   *
   * _Linux/Mac OS only._ */
  uid: number | null;
  /** Group ID of the owner of this file.
   *
   * _Linux/Mac OS only._ */
  gid: number | null;
  /** Device ID of this file.
   *
   * _Linux/Mac OS only._ */
  rdev: number | null;
  /** The size of the file, in bytes. */
  size: number;
  /** Blocksize for filesystem I/O.
   *
   * _Linux/Mac OS only._ */
  blksize: number | null;
  /** Number of blocks allocated to the file, in 512-byte units.
   *
   * _Linux/Mac OS only._ */
  blocks: number | null;
  /** The last modification time of the file. This corresponds to the `mtime`
   * field from `stat` on Linux/Mac OS and `ftLastWriteTime` on Windows. This
   * may not be available on all platforms. */
  mtime: Date | null;
  /** The last access time of the file. This corresponds to the `atime`
   * field from `stat` on Unix and `ftLastAccessTime` on Windows. This may not
   * be available on all platforms. */
  atime: Date | null;
  /** The creation time of the file. This corresponds to the `birthtime`
   * field from `stat` on Mac/BSD and `ftCreationTime` on Windows. This may
   * not be available on all platforms. */
  birthtime: Date | null;
  /** change time */
  ctime: Date | null;
  /** atime in milliseconds */
  atimeMs: number | null;
  /** atime in milliseconds */
  mtimeMs: number | null;
  /** atime in milliseconds */
  ctimeMs: number | null;
  /** atime in milliseconds */
  birthtimeMs: number | null;
  isBlockDevice: () => boolean;
  isCharacterDevice: () => boolean;
  isDirectory: () => boolean;
  isFIFO: () => boolean;
  isFile: () => boolean;
  isSocket: () => boolean;
  isSymbolicLink: () => boolean;
};

interface ParsedPath {
  /**
   * The root of the path such as '/' or 'c:\'
   */
  root: string;
  /**
   * The full directory path such as '/home/user/dir' or 'c:\path\dir'
   */
  dir: string;
  /**
   * The file name including extension (if any) such as 'index.html'
   */
  base: string;
  /**
   * The file extension (if any) such as '.html'
   */
  ext: string;
  /**
   * The file name without extension (if any) such as 'index'
   */
  name: string;
}

interface ResourceMap {
  // deno-lint-ignore no-explicit-any
  [rid: number]: any;
}
