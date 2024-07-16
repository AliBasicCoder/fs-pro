import { Dir } from "./dir";
import { File } from "./file";
import {
  addPlugin,
  getPluginTrack,
  getPluginTrackFormatted,
} from "./pluginAdder";
import { setFs, getFs } from "./fs";
import { setPath } from "./path";
import { Shape, __rest } from "./Shape";
import { buffer } from "./buffer";
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
      position = position ?? 0;
      offset = offset ?? 0;
      data = Buffer.from(data);
      length = length ?? data.length;

      if (!existsSync(path)) writeFileSync(path, "");
      const fd = openSync(path, "r+");
      // @ts-ignore
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
  // @ts-ignore
  readFileSync(path, position = 0, length, buffer, offset) {
    if (
      position !== 0 ||
      length !== undefined ||
      buffer !== undefined ||
      offset !== undefined
    ) {
      const fd = openSync(path, "r");
      const fileLength = length ?? statSync(path).size;
      const target = buffer || Buffer.alloc(length ?? fileLength - position);

      readSync(
        fd,
        target,
        buffer ? offset || 0 : 0,
        length ?? fileLength - position,
        position
      );
      closeSync(fd);

      return target;
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
  getFs,
  Shape,
  getPluginTrack,
  getPluginTrackFormatted,
  __rest,
};
