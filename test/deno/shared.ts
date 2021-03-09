import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts";
import type { File, Dir } from "../../mod.ts";
import { join, parse } from "https://deno.land/std@0.74.0/path/mod.ts";

export function fillArray<T>(
  arr: T[],
  times: number,
  func: (times: number) => T
) {
  for (let i = 0; i <= times; i++) {
    arr.push(func(times));
  }
}

export const randomDir = () =>
  `dir_${Math.random().toString().replace(".", "")}`;

export const randomFile = () =>
  `file_${Math.random().toString().replace(".", "")}`;

export const checkFileData = (file: File, path: string) => {
  const actual = parse(join(path));
  assertEquals(file.path, join(path));
  assertEquals(file.name, actual.name);
  assertEquals(file.extension, "");
  assertEquals(file.base, actual.base);
  assertEquals(file.root, actual.root);
  assertEquals(file.directory, actual.dir);
};

export function checkDirData(dir: Dir, path: string) {
  const actual = parse(join(path));
  assertEquals(dir.path, join(path));
  assertEquals(dir.name, actual.base);
  assertEquals(dir.root, actual.root);
  assertEquals(dir.parentDirectory, actual.dir);
}

export function customEqual(actual: any, expected: any) {
  if (Object.keys(actual).length !== Object.keys(expected).length) {
    throw new Error("Assertion Error: properties missing");
  }
  for (const key in expected) {
    // @ts-ignore
    const expectedKey = expected[key];
    // @ts-ignore
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
