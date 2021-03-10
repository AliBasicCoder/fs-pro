import * as assert from "assert";
import { FileType, DirType } from "./fs-pro";
import { join, parse } from "path";

export const randomDir = () =>
  `dir_${Math.random().toString().replace(".", "")}`;

export const randomFile = () =>
  `file_${Math.random().toString().replace(".", "")}`;

export function checkFileData(file: FileType, ...paths: string[]) {
  const expected = parse(join(...paths));

  assert.equal(file.path, join(...paths));
  assert.equal(file.name, expected.name);
  assert.equal(file.extension, "");
  assert.equal(file.base, expected.base);
  assert.equal(file.root, expected.root);
  assert.equal(file.directory, expected.dir);
}

export function checkDataDir(dir: DirType, ...paths: string[]) {
  const expected = parse(join(...paths));

  assert.equal(dir.path, join(...paths));
  assert.equal(dir.name, expected.base);
  assert.equal(dir.root, expected.root);
  assert.equal(dir.parentDirectory, expected.dir);
}

export function customEqual(actual: any, expected: any) {
  if (Object.keys(actual).length !== Object.keys(expected).length) {
    throw new Error("Assertion Error: properties missing");
  }
  for (const key in expected) {
    const expectedKey = expected[key];
    const actualKey = actual[key];

    if (typeof expectedKey === "function") continue;

    if (
      expectedKey instanceof Date
        ? expectedKey.getTime() !== actualKey.getTime()
        : actualKey !== expectedKey
    ) {
      throw new Error(
        `Assertion Error: property "${key}" doesn't match ${actualKey} !== ${expectedKey}`
      );
    }
  }
}
