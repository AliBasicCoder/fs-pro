/* eslint-disable no-console */
import { File, Dir, Model, Structure, addPlugin } from "../src/index";
import * as assert from "assert";
import { join, parse } from "path";
import { EventEmitter } from "events";
import {
  readFileSync,
  existsSync,
  statSync,
  mkdirSync,
  unlinkSync,
  rmdirSync,
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
  assert.equal(file.root, parse(__dirname).root);
  assert.equal(file.directory, someDir || __dirname);
};

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

function checkDataDir(dir: Dir, parent: string, name: string) {
  assert.equal(dir.path, join(parent, name));
  assert.equal(dir.name, name);
  assert.equal(dir.root, parse(__dirname).root);
  assert.equal(dir.parentDirectory, parent);
}

function dirIndex(num: number) {
  return `dir_${num}`;
}

describe("Dir", () => {
  it("have right data", (done) => {
    const dir = new Dir(__dirname, dirIndex(0));
    checkDataDir(dir, __dirname, dirIndex(0));
    done();
  });
  it(".create()", (done) => {
    const dir = new Dir(__dirname, dirIndex(0));
    dir.create();
    assert.equal(existsSync(dir.path), true);
    rmdirSync(dir.path);
    done();
  });
  it(".exits()", (done) => {
    const dir = new Dir(__dirname, dirIndex(1));
    assert.equal(dir.exits(), existsSync(dir.path));
    done();
  });
  it(".createFile()", (done) => {
    const dir = new Dir(__dirname, dirIndex(2)).create();
    const file = dir.createFile(fileIndex(19));
    assert.equal(file instanceof File, true);
    checkData(file, 19, dir.path);
    assert.equal(existsSync(file.path), true);
    file.delete();
    rmdirSync(dir.path);
    done();
  });
  it(".createDir()", (done) => {
    const dir = new Dir(__dirname, dirIndex(3)).create();
    const newDir = dir.createDir(dirIndex(4));
    assert.equal(newDir instanceof Dir, true);
    checkDataDir(newDir, dir.path, dirIndex(4));
    assert.equal(existsSync(newDir.path), true);
    rmdirSync(newDir.path);
    rmdirSync(dir.path);
    done();
  });
  it(".delete()", (done) => {
    const dir = new Dir(__dirname, dirIndex(5)).create();
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
  it(".getFile()", (done) => {
    const dir = new Dir(__dirname, dirIndex(6)).create();
    dir.createFile(fileIndex(20));
    const file = dir.getFile(fileIndex(20));
    assert.equal(file instanceof File, true);
    checkData(file, 20, dir.path);
    assert.equal(existsSync(file.path), true);
    dir.delete();
    done();
  });
  it(".getDir()", (done) => {
    const dir = new Dir(__dirname, dirIndex(7)).create();
    dir.createDir(dirIndex(8));
    const newDir = dir.getDir(dirIndex(8));
    assert.equal(newDir instanceof Dir, true);
    checkDataDir(newDir, dir.path, dirIndex(8));
    assert.equal(existsSync(newDir.path), true);
    dir.delete();
    done();
  });
  it(".read()", (done) => {
    const dir = new Dir(__dirname, dirIndex(9)).create();
    dir.createFile(fileIndex(21));
    dir.createDir(dirIndex(10));
    assert.deepEqual(dir.read(), [dirIndex(10), fileIndex(21)]);
    dir.delete();
    done();
  });
  it(".readResolve()", (done) => {
    const dir = new Dir(__dirname, dirIndex(10)).create();
    dir.createDir(dirIndex(11));
    dir.createFile(fileIndex(22));
    assert.deepEqual(dir.readResolve(), [
      new Dir(dir.path, dirIndex(11)),
      new File(dir.path, fileIndex(22)),
    ]);
    dir.delete();
    done();
  });
  it(".stats()", (done) => {
    const dir = new Dir(__dirname, dirIndex(12)).create();
    assert.equal(typeof dir.stat(), "object");
    dir.delete();
    done();
  });
  it(".deleteMatch()", (done) => {
    const dir = new Dir(__dirname, dirIndex(13)).create();
    dir.createDir(dirIndex(14));
    dir.deleteMath(/dir_12/);
    assert.equal(existsSync(join(dir.path, "dir_12")), false);
    dir.delete();
    done();
  });
  it(".deleteMachFile()", (done) => {
    const dir = new Dir(__dirname, dirIndex(15)).create();
    dir.createFile(fileIndex(23));
    dir.deleteMatchFile(/file_23/);
    assert.equal(existsSync(join(dir.path, "file_23")), false);
    dir.delete();
    done();
  });
  it(".deleteMatchDir()", (done) => {
    const dir = new Dir(__dirname, dirIndex(16)).create();
    dir.createDir(dirIndex(17));
    dir.deleteMatchDir(/dir_17/);
    assert.equal(existsSync(join(dir.path, dirIndex(17))), false);
    dir.delete();
    done();
  });
  it(".rename()", (done) => {
    const dir = new Dir(__dirname, dirIndex(17)).create();
    dir.rename(dirIndex(18));
    checkDataDir(dir, __dirname, dirIndex(18));
    assert.equal(existsSync(join(__dirname, dirIndex(18))), true);
    assert.equal(existsSync(join(__dirname, dirIndex(17))), false);
    dir.delete();
    done();
  });
  it(".forEach(), .forEachFile(), .forEachDir()", (done) => {
    const dir = new Dir(__dirname, dirIndex(19)).create();
    dir.createDir(dirIndex(20)).createFile(fileIndex(24));
    dir.createFile(fileIndex(25));
    // prettier-ignore
    const called = [{ dir: 0, file: 0 },{ dir: 0, file: 0 },{ dir: 0, file: 0 },{ dir: 0, file: 0 },{ dir: 0, file: 0 },{ dir: 0, file: 0 }];
    function callback(ind: number) {
      return (thing: File | Dir) => {
        if (thing instanceof Dir) called[ind].dir++;
        if (thing instanceof File) called[ind].file++;
      };
    }
    dir.forEach(callback(0), { recursive: true });
    dir.forEach(callback(1));
    dir.forEachFile(callback(2));
    dir.forEachFile(callback(3), { recursive: true });
    dir.forEachDir(callback(4));
    dir.forEachDir(callback(5), { recursive: true });
    assert.deepEqual(called[0], {
      dir: 1,
      file: 2,
    });
    assert.deepEqual(called[1], {
      dir: 1,
      file: 1,
    });
    assert.deepEqual(called[2], {
      dir: 0,
      file: 1,
    });
    assert.deepEqual(called[3], {
      dir: 0,
      file: 2,
    });
    assert.deepEqual(called[4], {
      dir: 1,
      file: 0,
    });
    assert.deepEqual(called[5], {
      dir: 1,
      file: 0,
    });
    dir.delete();
    done();
  });

  // TODO: adding test for that
  // it(".watch() .unwatch", done => {
  //   done();
  // });
});

const modelBase = {
  dum1: {
    dum3: Model.File(".txt"),
    dum5: Model.Dir(Model.File(".txt")),
  },
  dum2: {
    dum4: Model.File(".txt"),
    dum6: Model.Dir(Model.File(".txt")),
  },
  file: Model.File(".txt", "hello world"),
};

describe("Modal", () => {
  const model = new Model(modelBase);

  it(".structure()", (done) => {
    const stuck = model.structure(__dirname, "test9");

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

  it(".createAt()", (done) => {
    const stuckPath = join(__dirname, "test10");
    model.createAt(stuckPath);

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
  describe(".valid()", () => {
    it("a valid one", (done) => {
      const dir = new Dir(__dirname, "test11");
      model.createAt(dir.path);
      assert.equal(model.valid(dir.path), true);
      dir.delete();
      done();
    });
    it("an invalid one", (done) => {
      const dir = new Dir(__dirname, "test12").create();
      dir.createDir("dum3").createFile("dum34");
      assert.equal(model.valid(dir.path), false);
      dir.delete();
      done();
    });
  });
});

describe("Structure", () => {
  it(".create()", (done) => {
    const testDir = new Dir(__dirname, "test13");
    const model = new Model(modelBase);
    const stuck = model.structure<typeof modelBase>(testDir.path);
    const called = {
      onCreate: 0,
      onCreateFile: 0,
      onCreateDir: 0,
    };
    Structure.create(stuck, {
      onCreate() {
        called.onCreate++;
      },
      onCreateDir() {
        called.onCreateDir++;
      },
      onCreateFile() {
        called.onCreateFile++;
      },
    });
    assert.equal(existsSync(testDir.path), true);

    for (const key in modelBase) {
      // @ts-ignore
      const elem = modelBase[key];
      if (key !== "file") {
        const keys = Object.keys(elem);
        const file = new File(testDir.path, `${key}/${keys[0]}.txt`);
        const dir = new Dir(testDir.path, `${key}/${keys[1]}`);

        assert.equal(existsSync(file.path), true);
        assert.equal(existsSync(dir.path), true);
      } else {
        const file = new File(testDir.path, `${key}.txt`);
        assert.equal(existsSync(file.path), true);
        assert.equal(file.read().toString(), "hello world");
      }
    }
    assert.deepEqual(called, {
      onCreate: 8,
      onCreateDir: 5,
      onCreateFile: 3,
    });
    testDir.delete();
    done();
  });
});

it("addPlugin", (done) => {
  addPlugin({
    name: "xml",
    plugin: [
      {
        methodName: "xml",
        func: function () {
          return `the size is ${this.size}`;
        },
        // @ts-ignore
        className: "File",
        isStatic: false,
      },
      {
        methodName: "st",
        func: function () {
          return "hello there";
        },
        // @ts-ignore
        className: "File",
        isStatic: true,
      },
    ],
  });
  const file = new File("some_thing.txt").create();
  // @ts-ignore
  assert.equal(typeof file.xml, "function");
  // @ts-ignore
  assert.equal(file.xml(), "the size is 0");
  // @ts-ignore
  assert.equal(typeof File.st, "function");
  // @ts-ignore
  assert.equal(File.st(), "hello there");
  file.delete();
  done();
});
