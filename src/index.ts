import { Dir } from "./dir";
import { File } from "./file";
import { addPlugin } from "./pluginAdder";
import { setFs } from "./fs";
import { setPath } from "./path";
import watch from "node-watch";

setFs({
  ...require("fs"),
  watch,
});

setPath(require("path"));

export { File, Dir, addPlugin, setFs, setPath };
