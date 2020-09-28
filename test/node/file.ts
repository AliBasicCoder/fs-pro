import * as assert from "assert";
import { File } from "../../src/index";
import { join } from "path";
import {
  fileIndex,
  checkData,
  isReadableStream,
  isWritableStream,
} from "./shared";
import {
  readFileSync,
  existsSync,
  statSync,
  mkdirSync,
  unlinkSync,
  rmdirSync,
} from "fs";

describe("File", () => {
  it("have right data", (done) => {
    const file = new File(__dirname, fileIndex(0));
    checkData(file, 0);
    done();
  });

  it(".create()", (done) => {
    const file = new File(__dirname, fileIndex(0));
    file.create();
    assert.equal(existsSync(file.path), true);
    unlinkSync(file.path);
    done();
  });

  it(".exits()", (done) => {
    const file = new File(__dirname, fileIndex(1));
    assert.equal(file.exits(), existsSync(file.path));
    done();
  });

  it(".delete()", (done) => {
    const file = new File(__dirname, fileIndex(19)).create();
    file.delete();
    assert.equal(existsSync(file.path), false);
    done();
  });

  it(".write()", (done) => {
    const file = new File(__dirname, fileIndex(2));
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
    file.delete();
    done();
  });
  it(".json()", (done) => {
    const file = new File(__dirname, fileIndex(3));
    file.write({ hello: "world" });
    assert.deepEqual(file.json(), { hello: "world" });
    file.delete();
    done();
  });
  it(".validate() and file.valid()", (done) => {
    const file = new File(__dirname, fileIndex(4)).write({ hello: "world" });
    let called = 0;
    file.validator = (str) => {
      called++;
      return JSON.parse(str);
    };
    file.validate();
    assert.equal(called, 1);
    assert.equal(file.valid(), true);
    file.delete();
    done();
  });
  it(".read()", (done) => {
    const file = new File(__dirname, fileIndex(5)).write({ hello: "world" });
    assert.equal(file.read().toString(), JSON.stringify({ hello: "world" }));
    file.write("some\nline\nthing");
    let res = "";
    file.read("\n", (str, i) => (res += `${i + 1}| ${str}\n`));
    assert.equal(res, "1| some\n2| line\n3| thing\n");
    file.delete();
    done();
  });
  it(".overwrite()", (done) => {
    const file = new File(__dirname, fileIndex(6)).write("some\nline\nthing");
    file.overwrite("\n", (str, i) => `${i + 1}| ${str}\n`);
    assert.equal(file.read().toString(), "1| some\n2| line\n3| thing\n");
    file.delete();
    done();
  });
  it(".getIndex()", (done) => {
    const file = new File(__dirname, fileIndex(7)).write("1| some\n");
    assert.equal(file.getIndex("\n", 0), "1| some");
    file.delete();
    done();
  });
  it(".getIndexBetween()", (done) => {
    const file = new File(__dirname, fileIndex(8)).write("1| some\n");
    assert.deepEqual(file.getIndexBetween("\n", 0, 1), ["1| some"]);
    file.delete();
    done();
  });
  it(".append()", (done) => {
    const file = new File(__dirname, fileIndex(9));
    file.write("hello ").append("world");
    assert.equal(file.read().toString(), "hello world");
    file.delete();
    done();
  });
  it(".splitBy()", (done) => {
    const file = new File(__dirname, fileIndex(10)).write("hello world");
    assert.deepEqual(file.splitBy(" "), ["hello", "world"]);
    file.delete();
    done();
  });
  it(".stats()", (done) => {
    const file = new File(__dirname, fileIndex(11)).create();
    assert.deepEqual(file.stat(), statSync(file.path));
    file.delete();
    done();
  });
  it(".rename()", (done) => {
    const file = new File(__dirname, fileIndex(12)).create();
    file.rename(fileIndex(13));
    checkData(file, 13);
    assert.equal(existsSync(file.path), true);
    file.delete();
    done();
  });
  it(".copyTo()", (done) => {
    const file = new File(__dirname, fileIndex(14)).create();
    const test2 = join(__dirname, "test2");
    mkdirSync(test2);

    const newFile = file.copyTo(test2);
    checkData(newFile, 14, test2);
    assert.equal(existsSync(newFile.path), true);
    unlinkSync(newFile.path);

    const newFile2 = file.copyTo(test2, fileIndex(15));
    checkData(newFile2, 15, test2);
    assert.equal(existsSync(newFile2.path), true);
    unlinkSync(newFile2.path);

    const newFile3 = file.copyTo("./test2", null, true);
    checkData(newFile3, 14, test2);
    assert.equal(existsSync(newFile3.path), true);
    unlinkSync(newFile3.path);

    const newFile4 = file.copyTo("./test2", fileIndex(15), true);
    checkData(newFile4, 15, test2);
    assert.equal(existsSync(newFile4.path), true);
    unlinkSync(newFile4.path);

    file.delete();
    done();
  });
  it(".moveTo()", (done) => {
    const file = new File(__dirname, fileIndex(16)).create();
    const test2 = join(__dirname, "test2");
    file.moveTo(test2);
    checkData(file, 16, test2);
    assert.equal(existsSync(file.path), true);
    file.delete();
    rmdirSync(test2);
    done();
  });
  it(".createReadStream()", (done) => {
    const file = new File(__dirname, fileIndex(17)).create();
    const stream = file.createReadStream();
    assert.equal(isReadableStream(stream), true);
    stream.close();
    file.delete();
    done();
  });
  it(".createWriteStream()", (done) => {
    const file = new File(__dirname, fileIndex(18)).create();
    const stream = file.createWriteStream();
    assert.equal(isWritableStream(stream), true);
    stream.close();
    file.delete();
    done();
  });
  // TODO: find a way to this test
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
});
