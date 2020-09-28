import * as assert from "assert";
import { File, Dir } from "../../src/index";
import { join } from "path";
import { existsSync, rmdirSync } from "fs";
import { checkDataDir, dirIndex, fileIndex, checkData } from "./shared";

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
