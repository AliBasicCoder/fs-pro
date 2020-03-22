/* eslint-disable no-console */
import { File, Dir, Model } from "../src/index";
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

function checkDataDir(dir: Dir, parent: string, name: string) {
  assert.equal(dir.path, join(parent, name));
  assert.equal(dir.name, name);
  assert.equal(dir.root, "/");
  assert.equal(dir.parentDirectory, parent);
}

describe("Dir", () => {
  const dir = new Dir(__dirname, "test3");
  it("have right data", done => {
    checkDataDir(dir, __dirname, "test3");
    done();
  });
  it(".create()", done => {
    dir.create();
    assert.equal(existsSync(dir.path), true);
    done();
  });
  it(".createFile()", done => {
    const file = dir.createFile(fileIndex(4));
    assert.equal(file instanceof File, true);
    checkData(file, 4, dir.path);
    assert.equal(existsSync(file.path), true);
    done();
  });
  it(".createDir()", done => {
    const newDir = dir.createDir("test4");
    assert.equal(newDir instanceof Dir, true);
    checkDataDir(newDir, dir.path, "test4");
    assert.equal(existsSync(newDir.path), true);
    done();
  });
  it(".read()", done => {
    assert.deepEqual(dir.read(), [fileIndex(4), "test4"]);
    done();
  });
  it(".stats()", done => {
    assert.equal(typeof dir.stats(), "object");
    done();
  });
  it(".deleteMatch()", done => {
    dir.deleteMath(/test4/);
    assert.equal(existsSync(join(dir.path, "test4")), false);
    done();
  });
  it(".deleteMachFile()", done => {
    dir.deleteMatchFile(/file_4/);
    assert.equal(existsSync(join(dir.path, "file_4")), false);
    done();
  });
  it(".deleteMatchDir()", done => {
    dir.createDir("test5");
    dir.deleteMatchDir(/test5/);
    assert.equal(existsSync(join(dir.path, "test5")), false);
    done();
  });
  it(".rename()", done => {
    dir.rename("test6");
    checkDataDir(dir, __dirname, "test6");
    assert.equal(existsSync(join(__dirname, "test6")), true);
    assert.equal(existsSync(join(__dirname, "test3")), false);
    done();
  });
  // TODO: adding test for that
  // it(".watch() .unwatch", done => {
  //   done();
  // });
  it(".delete()", done => {
    // creating a bunch of files and folders
    const someDir1 = dir.createDir("some1");
    const someDir2 = someDir1.createDir("some2");
    someDir1.createFile("file1");
    someDir1.createFile("file2");
    someDir2.createFile("file1");
    someDir2.createFile("file2");
    dir.createFile("file3");
    dir.delete();
    assert.equal(existsSync(dir.path), false);
    done();
  });
});

describe("Modal", () => {
  const modelBase = {
    dum1: {
      dum3: Model.File(".txt"),
      dum5: Model.Dir(Model.File(".txt"))
    },
    dum2: {
      dum4: Model.File(".txt"),
      dum6: Model.Dir(Model.File(".txt"))
    },
    file: Model.File(".txt", "hello world")
  };
  const modal = new Model(modelBase);

  it(".structure()", done => {
    const stuck = modal.structure(join(__dirname, "test9"));

    for (const key in modelBase) {
      // @ts-ignore
      const elem = modelBase[key];
      if (key !== "file") {
        const keys = Object.keys(elem);

        assert.equal(stuck[key][keys[0]] instanceof File, true);
        assert.equal(stuck[key][keys[1]] instanceof Dir, true);
      } else {
        assert.equal(stuck[key] instanceof File, true);
      }
    }
    done();
  });

  it(".createAt()", done => {
    const stuckPath = join(__dirname, "test10");
    modal.createAt(stuckPath);

    assert.equal(stuckPath, join(__dirname, "test10"));
    assert.equal(existsSync(stuckPath), true);

    for (const key in modelBase) {
      // @ts-ignore
      const elem = modelBase[key];
      if (key !== "file") {
        const keys = Object.keys(elem);
        const file = new File(stuckPath, `${key}/${keys[0]}.txt`);
        const dir = new Dir(stuckPath, `${key}/${keys[1]}`);

        assert.equal(existsSync(file.path), true);
        assert.equal(existsSync(dir.path), true);
      } else {
        const file = new File(stuckPath, `${key}.txt`);
        assert.equal(existsSync(file.path), true);
        assert.equal(file.read().toString(), "hello world");
      }
    }
    new Dir(stuckPath).delete();
    done();
  });
});
