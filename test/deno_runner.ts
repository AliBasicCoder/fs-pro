import "../mod.ts";
import "./dir.test.ts";
import "./file.test.ts";
import "./plugin.test.ts";
import "./shape.test.ts";
import { setImports, tests } from "./imports.ts";
import {
  existsSync,
  statSync,
  lstatSync,
} from "https://deno.land/std@0.131.0/node/fs.ts";
import { join, parse } from "https://deno.land/std@0.131.0/path/mod.ts";
import {
  assertEquals,
  assert,
  assertThrows,
} from "https://deno.land/std@0.131.0/testing/asserts.ts";

const tmp_dir = parse(Deno.makeTempDirSync()).dir;

function load_deno() {
  setImports({
    assertEquals,
    assert,
    assertThrows,
    join,
    parse,
    existsSync,
    statSync,
    lstatSync,
    makeTempFileSync: Deno.makeTempFileSync,
    makeTempDirSync: Deno.makeTempDirSync,
    readTextFileSync: Deno.readTextFileSync,
    writeTextFileSync: Deno.writeTextFileSync,
    // deno-lint-ignore no-deprecated-deno-api
    resources: Deno.resources,
    tempDir: () => tmp_dir,
    writeSync: () => {},
    readSync: () => {},
  });
  for (const test_ of tests) {
    Deno.test({
      name: test_.name,
      ignore: test_.ignore,
      fn: () => test_.fn(),
    });
  }
}

load_deno();
