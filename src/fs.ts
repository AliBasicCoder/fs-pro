import {
  fsObjType,
  Stats,
  BigIntOptions,
  PathLike,
  BigIntStats,
  StatOptions,
} from "./types";

let fs: fsObjType;

/**
 * this function allows you to override the fs module that fs-pro uses
 * @NOTE the watch method must follow the "node-watch" package api
 * not node fs
 * @param newFs the new fs
 */
export function setFs(newFs: fsObjType) {
  fs = newFs;
}

export function appendFileSync(
  ...args: Parameters<fsObjType["appendFileSync"]>
) {
  return fs.appendFileSync(...args);
}

export function copyFileSync(...args: Parameters<fsObjType["copyFileSync"]>) {
  return fs.copyFileSync(...args);
}

export function createReadStream(
  ...args: Parameters<fsObjType["createReadStream"]>
) {
  return fs.createReadStream(...args);
}

export function createWriteStream(
  ...args: Parameters<fsObjType["createWriteStream"]>
) {
  return fs.createWriteStream(...args);
}

export function existsSync(...args: Parameters<fsObjType["existsSync"]>) {
  return fs.existsSync(...args);
}

export function readFileSync(...args: Parameters<fsObjType["readFileSync"]>) {
  return fs.readFileSync(...args);
}

export function renameSync(...args: Parameters<fsObjType["renameSync"]>) {
  return fs.renameSync(...args);
}

export function writeFileSync(...args: Parameters<fsObjType["writeFileSync"]>) {
  return fs.writeFileSync(...args);
}

export function chmodSync(...args: Parameters<fsObjType["chmodSync"]>) {
  return fs.chmodSync(...args);
}

export function lstatSync(...args: Parameters<fsObjType["lstatSync"]>) {
  return fs.lstatSync(...args);
}

export function unlinkSync(...args: Parameters<fsObjType["unlinkSync"]>) {
  return fs.unlinkSync(...args);
}

function statSync(path: PathLike): Stats;
function statSync(path: PathLike, options: BigIntOptions): BigIntStats;
function statSync(path: PathLike, options: StatOptions): Stats | BigIntStats;
function statSync(
  path: PathLike,
  options?: BigIntOptions | StatOptions
): Stats | BigIntStats {
  if (options) return fs.statSync(path, options);
  return fs.statSync(path);
}

export { statSync };

export function mkdirSync(...args: Parameters<fsObjType["mkdirSync"]>) {
  return fs.mkdirSync(...args);
}

export function readdirSync(path: string) {
  return fs.readdirSync(path);
}

export function rmdirSync(...args: Parameters<fsObjType["rmdirSync"]>) {
  return fs.rmdirSync(...args);
}

export function watch(...args: Parameters<fsObjType["watch"]>) {
  return fs.watch(...args);
}

export function tmpFile() {
  return fs.mkTempFile();
}

export function tmpDir() {
  return fs.mkTempDir();
}
