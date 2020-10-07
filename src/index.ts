import { Dir } from "./dir.ts";
import { File } from "./file.ts";
import { addPlugin } from "./pluginAdder.ts";
import { setFs } from "./fs.ts";
import { setPath } from "./path.ts";
import { Shape } from "./Shape.ts";
import { watch, WatchOptions } from "chokidar";
import {
  appendFileSync,
  copyFileSync,
  existsSync,
  renameSync,
  writeFileSync,
  chmodSync,
  lstatSync,
  unlinkSync,
  statSync,
  mkdirSync,
  readdirSync,
  rmdirSync,
  readFileSync
} from "fs";
import { join, parse } from "path";
import { fileSync, dirSync } from "tmp";

setFs({
  appendFileSync,
  copyFileSync,
  existsSync,
  renameSync,
  writeFileSync,
  chmodSync,
  lstatSync,
  unlinkSync,
  statSync,
  mkdirSync,
  readdirSync,
  rmdirSync,
  // @ts-ignore
  readFileSync,
  watch(path: string, options?: WatchOptions) {
    return watch(path, options);
  },
  mkTempDir() {
    return dirSync().name;
  },
  mkTempFile() {
    return fileSync().name;
  },
});

setPath({ join, parse });

export { File, Dir, addPlugin, setFs, Shape };
