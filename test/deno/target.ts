import "../../src/index.ts";
import "./dir.test.ts";
import "./file.test.ts";
import "./plugin.test.ts";
import "./shape.test.ts";
import { setImports, tests, getImports } from "./imports.ts";

function load_node() {
  // @ts-ignore
  const fs = require("fs");
  // @ts-ignore
  const assert = require("assert");
  // @ts-ignore
  const path = require("path");
  // @ts-ignore
  const tmp = require("tmp");
  // @ts-ignore
  const os = require("os");

  setImports({
    assertEquals: assert.deepEqual,
    assert: assert.ok,
    assertThrows: assert.throws,
    join: path.join,
    parse: path.parse,
    existsSync: fs.existsSync,
    statSync: fs.statSync,
    makeTempDirSync: () => tmp.dirSync().name,
    makeTempFileSync: () => tmp.fileSync().name,
    readTextFileSync: (path) => fs.readFileSync(path, "utf-8"),
    writeTextFileSync: fs.writeFileSync,
    resources: () => ({}),
    tempDir: os.tmpdir,
    writeSync: fs.writeSync,
    readSync: fs.readSync,
  });
}

load_node();

export { tests, getImports };
