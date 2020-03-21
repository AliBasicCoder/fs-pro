/* eslint-disable no-console */
import { File } from "../src/index";
import * as assert from "assert";
import { join } from "path";
import { EventEmitter } from "events";
import {
  readFileSync,
  existsSync,
  statSync,
  mkdirSync,
  unlinkSync,
  rmdirSync
  //  Stats
} from "fs";

function isReadableStream(test: any): boolean {
  // @ts-ignore
  return test instanceof EventEmitter && typeof test.read === "function";
}

function isWritableStream(test: any) {
  return (
    test instanceof EventEmitter &&
    // @ts-ignore
    typeof test.write === "function" &&
    // @ts-ignore
    typeof test.end === "function"
  );
}

const fileIndex = (index: number) => `file_${index}`;

const checkData = (file: File, index: number, someDir?: string) => {
  assert.equal(file.path, join(someDir || __dirname, fileIndex(index)));
  assert.equal(file.name, fileIndex(index));
  assert.equal(file.extension, "");
  assert.equal(file.base, fileIndex(index));
  assert.equal(file.root, "/");
  assert.equal(file.directory, someDir || __dirname);
};

describe("File", () => {
  const file = new File(__dirname, fileIndex(0));

  it("have right data", done => {
    checkData(file, 0);
    done();
  });

  it(".create()", done => {
    file.create();
    assert.equal(existsSync(file.path), true);
    done();
  });

  it(".write()", done => {
    // string writes
    file.write("hello world");
    assert.equal(readFileSync(file.path, "utf8"), "hello world");
    // buffer writes
    file.write(Buffer.from("hello world"));
    assert.equal(readFileSync(file.path, "utf8"), "hello world");
    // json writes
    const obj = { hello: "world" };
    file.write(obj);
    assert.equal(readFileSync(file.path, "utf8"), JSON.stringify(obj));
    done();
  });
  it(".read()", done => {
    assert.equal(file.read().toString(), JSON.stringify({ hello: "world" }));
    done();
  });
  it(".json()", done => {
    assert.deepEqual(file.json(), { hello: "world" });
    done();
  });
  it(".append()", done => {
    file.write("hello ").append("world");
    assert.equal(file.read().toString(), "hello world");
    done();
  });
  it(".splitBy()", done => {
    assert.deepEqual(file.splitBy(" "), ["hello", "world"]);
    done();
  });
  it(".stats()", done => {
    assert.deepEqual(file.stats(), statSync(file.path));
    done();
  });
  it(".rename()", done => {
    file.rename(fileIndex(1));
    checkData(file, 1);
    assert.equal(existsSync(file.path), true);
    done();
  });
  it(".copyTo()", done => {
    const newFile = file.copyTo(fileIndex(2));
    checkData(newFile, 2);
    assert.equal(existsSync(newFile.path), true);
    unlinkSync(newFile.path);
    done();
  });
  it(".moveTo()", done => {
    mkdirSync(join(__dirname, "test2"));
    file.moveTo(join(__dirname, "test2"));
    checkData(file, 1, join(__dirname, "test2"));
    assert.equal(existsSync(file.path), true);
    done();
  });
  it(".createReadStream()", done => {
    assert.equal(isReadableStream(file.createReadStream()), true);
    done();
  });
  it(".createWriteStream()", done => {
    assert.equal(isWritableStream(file.createWriteStream()), true);
    done();
  });
  // TODO: find a way to test this
  // it(".watch() .unWatch()", done => {
  //   let called = 0;
  //   file.watch(function(curr: Stats, prev: Stats) {
  //     assert.equal(typeof curr, "object");
  //     assert.equal(typeof prev, "object");
  //     assert.equal(this.read().toString(), "hello world");
  //     called++;
  //   });
  //   file.write("hello world");
  //   file.unwatch();
  //   file.write("hello world2");
  //   assert.equal(called, 1);
  //   done();
  // });
  it(".delete()", done => {
    file.delete();
    assert.equal(existsSync(file.path), false);
    rmdirSync(join(__dirname, "test2"));
    done();
  });
});
