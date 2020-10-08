import { File } from "./src/file.ts";
import { Dir } from "./src/dir.ts";
import { Shape } from "./src/Shape.ts";
import { setFs } from "./src/fs.ts";
import { setPath } from "./src/path.ts";
import type { Stats } from "./src/types.ts";
import { buffer } from "./src/buffer.ts";
import { Buffer } from "https://x.nest.land/node_buffer@1.1.0/mod.ts";
import { join, parse } from "https://deno.land/std@0.73.0/path/mod.ts";
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
  watch
} from "https://raw.githubusercontent.com/denoland/deno/master/std/node/fs.ts";

setFs({
  appendFileSync,
  copyFileSync,
  existsSync,
  renameSync,
  writeFileSync,
  chmodSync,
  unlinkSync,
  mkdirSync,
  readdirSync,
  rmdirSync,
  watch,
  lstatSync(path: string): Stats {
    // @ts-ignore
    return lstatSync(path);
  },
  statSync(path: string): Stats {
    // @ts-ignore
    return statSync(path);
  },
  readFileSync(path: string) {
    return Buffer.from(Deno.readFileSync(path));
  },
  mkTempDir() {
    return Deno.makeTempDirSync();
  },
  mkTempFile() {
    return Deno.makeTempFileSync();
  }
});

setPath({ join, parse });

buffer.setBuffer(Buffer);

export { File, Dir, Shape, setFs, Buffer };
