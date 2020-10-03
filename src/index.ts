import { Dir } from "./dir";
import { File } from "./file";
import { addPlugin } from "./pluginAdder";
import { setFs } from "./fs";
import { setPath } from "./path";
import { Shape } from "./Shape";
import { watch, WatchOptions } from "chokidar";
import * as fs from "fs";
import * as path from "path";
import { fileSync, dirSync } from "tmp";

setFs({
  ...fs,
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

setPath(path);

export { File, Dir, addPlugin, setFs, setPath, Shape };
