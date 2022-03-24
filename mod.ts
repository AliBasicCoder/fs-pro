import { File } from "./src/file.ts";
import { Dir } from "./src/dir.ts";
import { Shape } from "./src/Shape.ts";
import { setFs } from "./src/fs.ts";
import { setPath } from "./src/path.ts";
import type { Stats } from "./src/types.ts";
import { buffer } from "./src/buffer.ts";
import {
  addPlugin,
  getPluginTrack,
  getPluginTrackFormatted,
} from "./src/pluginAdder.ts";
import { Buffer } from "https://x.nest.land/node_buffer@1.1.0/mod.ts";
import { join, parse } from "https://deno.land/std@0.131.0/path/mod.ts";
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
  openSync,
  closeSync,
  watch,
} from "https://deno.land/std@0.131.0/node/fs.ts";

setFs({
  appendFileSync,
  copyFileSync,
  existsSync,
  renameSync,
  writeFileSync(path, data, position, length, offset) {
    if (offset || length || position) {
      const file = Deno.openSync(path, {
        read: true,
        write: true,
        create: true,
      });
      if (position !== undefined)
        Deno.seekSync(file.rid, position, Deno.SeekMode.Start);
      const toWrite = (typeof data === "string"
        ? new TextEncoder().encode(data)
        : data
      ).slice(offset, !offset || !length ? undefined : offset + length);
      file.writeSync(toWrite);
      Deno.close(file.rid);
    } else {
      return writeFileSync(path, data);
    }
  },
  chmodSync,
  unlinkSync,
  mkdirSync,
  readdirSync,
  rmdirSync,
  watch,
  openSync,
  closeSync,
  lstatSync(path): Stats {
    // @ts-ignore
    return lstatSync(path);
  },
  statSync(path): Stats {
    // @ts-ignore
    return statSync(path);
  },
  readFileSync(path, position, length) {
    if (length || position) {
      const file = Deno.openSync(path, { read: true });
      const buffer_len =
        length !== undefined
          ? length
          : Deno.statSync(path).size - (position || 0);
      const buffer = new Uint8Array(buffer_len);
      if (position) Deno.seekSync(file.rid, position, Deno.SeekMode.Start);
      file.readSync(buffer);
      Deno.close(file.rid);
      return Buffer.from(buffer);
    }
    return Buffer.from(Deno.readFileSync(path));
  },
  mkTempDir() {
    return Deno.makeTempDirSync();
  },
  mkTempFile() {
    return Deno.makeTempFileSync();
  },
  linkSync: Deno.linkSync,
  symlinkSync: Deno.symlinkSync,
  truncateSync: Deno.truncateSync,
});

setPath({ join, parse });

buffer.setBuffer(Buffer);

export {
  File,
  Dir,
  Shape,
  setFs,
  Buffer,
  addPlugin,
  getPluginTrack,
  getPluginTrackFormatted,
};
