import { Dir } from "./dir.ts";
import { File } from "./file.ts";
import {
  addPlugin,
  getPluginTrack,
  getPluginTrackFormatted,
} from "./pluginAdder.ts";
import { setFs } from "./fs.ts";
import { setPath } from "./path.ts";
import { Shape } from "./Shape.ts";
import { buffer } from "./buffer.ts";
import { watch } from "chokidar";
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
  readFileSync,
  openSync,
  closeSync,
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
  openSync,
  closeSync,
  // @ts-ignore
  readFileSync,
  watch(path: string) {
    return watch(path);
  },
  mkTempDir() {
    return dirSync().name;
  },
  mkTempFile() {
    return fileSync().name;
  },
});

setPath({ join, parse });

// @ts-ignore
buffer.setBuffer(Buffer);

export {
  File,
  Dir,
  addPlugin,
  setFs,
  Shape,
  getPluginTrack,
  getPluginTrackFormatted,
};
