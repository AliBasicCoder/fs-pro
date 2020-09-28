import { Dir } from "./dir";
import { File } from "./file";
import { addPlugin } from "./pluginAdder";
import { setFs } from "./fs";
import { setPath } from "./path";
import watch from "node-watch";
import * as fs from "fs";
import * as path from "path";
import { fileSync, dirSync } from "tmp";

setFs({
  ...fs,
  watch,
  mkTempDir() {
    return dirSync().name;
  },
  mkTempFile() {
    return fileSync().name;
  },
});

setPath(path);

export { File, Dir, addPlugin, setFs, setPath };
