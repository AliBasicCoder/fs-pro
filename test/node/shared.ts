import * as assert from "assert";
import { File, Dir } from "../../src/index";
import { join, parse } from "path";
import { EventEmitter } from "events";

export const randomDir = () =>
  `dir_${Math.random().toString().replace(".", "")}`;

export const randomFile = () =>
  `file_${Math.random().toString().replace(".", "")}`;

export const checkData = (file: File, name: string, someDir: string) => {
  assert.equal(file.path, join(someDir, name));
  assert.equal(file.name, name);
  assert.equal(file.extension, "");
  assert.equal(file.base, name);
  assert.equal(file.root, parse(someDir).root);
  assert.equal(file.directory, someDir);
};

export function checkDataDir(dir: Dir, parent: string, name: string) {
  assert.equal(dir.path, join(parent, name));
  assert.equal(dir.name, name);
  assert.equal(dir.root, parse(parent).root);
  assert.equal(dir.parentDirectory, parent);
}

export function isReadableStream(test: any): boolean {
  // @ts-ignore
  return test instanceof EventEmitter && typeof test.read === "function";
}

export function isWritableStream(test: any) {
  return (
    test instanceof EventEmitter &&
    // @ts-ignore
    typeof test.write === "function" &&
    // @ts-ignore
    typeof test.end === "function"
  );
}