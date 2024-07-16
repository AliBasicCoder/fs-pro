import fs from "fs";
import assert from "assert";
import path from "path";
import tmp from "tmp";
import os from "os";
import "../src/node";
import "./dir.test";
import "./file.test";
import "./plugin.test";
import "./shape.test";
import { setImports, tests } from "./imports";

setImports({
  assertEquals: assert.deepStrictEqual,
  assert: assert.ok,
  assertThrows: assert.throws,
  join: path.join,
  parse: path.parse,
  existsSync: fs.existsSync,
  statSync: fs.statSync,
  lstatSync: fs.lstatSync,
  makeTempDirSync: () => tmp.dirSync().name,
  makeTempFileSync: () => tmp.fileSync().name,
  readTextFileSync: (path) => fs.readFileSync(path, "utf-8"),
  writeTextFileSync: fs.writeFileSync,
  resources: () => ({}),
  tempDir: os.tmpdir,
  writeSync: fs.writeSync,
  readSync: fs.readSync,
});

for (const test of tests) {
  if (test.ignore) {
    it.skip(test.name, test.fn);
  } else it(test.name, test.fn);
}
