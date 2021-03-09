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
  symlinkSync,
  linkSync,
  truncateSync,
  readSync,
  writeSync,
} from "fs";
import { join, parse } from "path";
import { fileSync, dirSync } from "tmp";

setFs({
  appendFileSync,
  copyFileSync,
  existsSync,
  renameSync,
  writeFileSync(path, data, position, length, offset) {
    if (offset || length || position) {
      if (!existsSync(path)) writeFileSync(path, "");
      const fd = openSync(path, "r+");
      writeSync(fd, data, offset, length, position);
      closeSync(fd);
    } else {
      return writeFileSync(path, data);
    }
  },
  chmodSync,
  lstatSync,
  unlinkSync,
  statSync,
  mkdirSync,
  readdirSync,
  rmdirSync,
  openSync(path, flag) {
    return openSync(path, flag || "r");
  },
  closeSync,
  readFileSync(path, position, length, buffer, offset) {
    if (position || length || buffer || offset) {
      length = length ?? statSync(path).size;
      position = position ?? 0;
      const fd = openSync(path, "r");
      // @ts-ignore
      const target = buffer || Buffer.alloc(length - position);
      readSync(fd, target, buffer ? offset : 0, length, position);
      closeSync(fd);
    } else {
      return readFileSync(path);
    }
  },
  watch(path: string) {
    return watch(path);
  },
  mkTempDir() {
    return dirSync().name;
  },
  mkTempFile() {
    return fileSync().name;
  },
  symlinkSync,
  linkSync,
  truncateSync,
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
