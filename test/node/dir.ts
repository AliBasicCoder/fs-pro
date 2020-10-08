import * as assert from "assert";
import { File, Dir } from "../../src/index";
import { join } from "path";
import { existsSync, rmdirSync } from "fs";
import * as os from "os";
import { checkDataDir, checkData, randomDir, randomFile } from "./shared";

function fillArray<T>(arr: T[], times: number, func: (times: number) => T) {
  for (let i = 0; i <= times; i++) {
    arr.push(func(times));
  }
}

describe("Dir", () => {
  it("have right data", (done) => {
    const name = randomDir();
    const dir = new Dir(__dirname, name);
    checkDataDir(dir, __dirname, name);
    done();
  });

  it(".create()", (done) => {
    const dir = new Dir(os.tmpdir(), randomDir()).create();
    assert.equal(existsSync(dir.path), true);
    rmdirSync(dir.path);
    done();
  });

  it(".exits()", (done) => {
    const dir = new Dir(__dirname, randomDir());
    assert.equal(dir.exits(), existsSync(dir.path));
    done();
  });

  it(".delete()", (done) => {
    const dir = Dir.tmpDir();
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

  it(".delete() (empty folder)", (done) => {
    const dir = Dir.tmpDir();
    dir.delete();
    done();
  });

  it(".createFile()", (done) => {
    const dir = Dir.tmpDir();
    const file_base = randomFile();
    const file = dir.createFile(file_base);
    assert.equal(file instanceof File, true);
    checkData(file, file_base, dir.path);
    assert.equal(existsSync(file.path), true);
    file.delete();

    const file2_base = randomFile();
    const file2 = dir.createFile(`foo/bar/hi/bye/${file2_base}`, true);
    assert.equal(file2 instanceof File, true);
    checkData(file2, file2_base, join(dir.path, "foo/bar/hi/bye"));
    assert.equal(existsSync(file2.path), true);
    file2.delete();
    dir.delete();
    done();
  });

  it(".createDir()", (done) => {
    const dir = Dir.tmpDir();
    const subDir = dir.createDir(randomDir());
    assert.equal(subDir instanceof Dir, true);
    checkDataDir(subDir, dir.path, subDir.name);
    assert.equal(existsSync(subDir.path), true);

    const subDir2 = dir.createDir(`foo/bar/${randomDir()}`, true);
    assert.equal(subDir2 instanceof Dir, true);
    checkDataDir(subDir2, join(dir.path, "foo/bar"), subDir2.name);
    assert.equal(existsSync(subDir2.path), true);
    dir.delete();
    done();
  });

  it(".getFile()", (done) => {
    const dir = Dir.tmpDir();
    const file_base = randomFile();
    dir.createFile(file_base);
    const file = dir.getFile(file_base);
    assert.equal(file instanceof File, true);
    checkData(file, file_base, dir.path);
    assert.equal(existsSync(file.path), true);
    dir.delete();
    done();
  });
  it(".getDir()", (done) => {
    const dir = Dir.tmpDir();
    const newDir_name = randomDir();
    dir.createDir(newDir_name);
    const newDir = dir.getDir(newDir_name);
    assert.equal(newDir instanceof Dir, true);
    checkDataDir(newDir, dir.path, newDir_name);
    assert.equal(existsSync(newDir.path), true);
    dir.delete();
    done();
  });
  it(".read()", (done) => {
    const dir = Dir.tmpDir();
    const sub_file = dir.createFile(randomFile());
    const sub_dir = dir.createDir(randomDir());
    assert.deepEqual(dir.read(), [sub_dir.name, sub_file.base]);
    dir.delete();
    done();
  });
  it(".readResolve()", (done) => {
    const dir = Dir.tmpDir();
    const sub_dir = dir.createDir(randomDir());
    const sub_file = dir.createFile(randomFile());
    assert.deepEqual(dir.readResolve(), [
      new Dir(dir.path, sub_dir.name),
      new File(dir.path, sub_file.base),
    ]);
    dir.delete();
    done();
  });
  it(".stats()", (done) => {
    const dir = Dir.tmpDir();
    assert.equal(typeof dir.stat(), "object");
    dir.delete();
    done();
  });
  it(".deleteMatch()", (done) => {
    // TODO: improve this testing
    const dir = Dir.tmpDir();
    const sub_dir = dir.createDir(randomDir());
    dir.deleteMath(RegExp(sub_dir.name));
    assert.equal(sub_dir.exits(), false);
    dir.delete();
    done();
  });
  it(".deleteMachFile()", (done) => {
    // TODO: improve this testing
    const dir = Dir.tmpDir();
    const sub_file = dir.createFile(randomFile());
    dir.deleteMatchFile(RegExp(sub_file.base));
    assert.equal(sub_file.exits(), false);
    dir.delete();
    done();
  });
  it(".deleteMatchDir()", (done) => {
    const dir = Dir.tmpDir();
    const sub_dir = dir.createDir(randomDir());
    dir.deleteMatchDir(RegExp(sub_dir.name));
    assert.equal(existsSync(sub_dir.path), false);
    dir.delete();
    done();
  });
  it(".rename()", (done) => {
    const dir = Dir.tmpDir();
    const old_name = dir.name;
    const new_name = randomDir();
    dir.rename(new_name);
    checkDataDir(dir, os.tmpdir(), new_name);
    assert.equal(existsSync(join(os.tmpdir(), new_name)), true);
    assert.equal(existsSync(join(os.tmpdir(), old_name)), false);
    dir.delete();
    done();
  });
  it(".forEach(), .forEachFile(), .forEachDir()", (done) => {
    function callback(ind: number) {
      return (thing: File | Dir) => {
        if (thing instanceof Dir) called[ind].dir++;
        if (thing instanceof File) called[ind].file++;
      };
    }
    const dir = Dir.tmpDir();
    dir.createDir(randomDir()).createFile(randomFile());
    dir.createFile(randomFile());
    const called: { file: number; dir: number }[] = [];
    fillArray(called, 5, () => ({ file: 0, dir: 0 }));
    dir.forEach(callback(0), { recursive: true });
    dir.forEach(callback(1));
    dir.forEachFile(callback(2));
    dir.forEachFile(callback(3), { recursive: true });
    dir.forEachDir(callback(4));
    dir.forEachDir(callback(5), { recursive: true });
    assert.deepEqual(called, [
      {
        dir: 1,
        file: 2,
      },
      {
        dir: 1,
        file: 1,
      },
      {
        dir: 0,
        file: 1,
      },
      {
        dir: 0,
        file: 2,
      },
      {
        dir: 1,
        file: 0,
      },
      {
        dir: 1,
        file: 0,
      },
    ]);
    dir.delete();
    done();
  });

  it(".copyTo()", () => {
    const dir = Dir.tmpDir();
    const filesArr = [
      "some.txt",
      "some_dir/some.txt",
      "empty_dir",
      "foo/bar/hi/deep_file.txt",
      "foo/bar/hi/deep_empty_dir",
    ];
    filesArr.forEach((item) => dir.createFile(item, true));

    const newDir = dir.copyTo("../", `${dir.name}_copied`, true);
    checkDataDir(newDir, os.tmpdir(), `${dir.name}_copied`);
    filesArr.forEach((item) => {
      assert.equal(newDir.getFile(item).exits(), true);
    });
    dir.delete();
    newDir.delete();
  });

  it(".moveTo()", () => {
    const dir = Dir.tmpDir();
    const filesArr = [
      "some.txt",
      "some_dir/some.txt",
      "empty_dir",
      "foo/bar/hi/deep_file.txt",
      "foo/bar/hi/deep_empty_dir",
    ];
    filesArr.forEach((item) => dir.createFile(item, true));

    const old_dir_name = dir.name;
    dir.moveTo("../", `${dir.name}_moved`, true);
    checkDataDir(dir, os.tmpdir(), `${old_dir_name}_moved`);
    filesArr.forEach((item) => {
      assert.equal(dir.getFile(item).exits(), true);
    });
    dir.delete();
  });

  it(".watch() .unwatch()", async () => {
    // skipping macos
    if (process.platform === "darwin") return;
    const track: any[] = [];
    const dir = Dir.tmpDir();
    dir.watch((...args: any[]) => track.push(args));
    await wait(100);
    const sub_dir = dir.createDir("hi");
    await wait(100);
    sub_dir.delete();
    await wait(100);
    dir.unwatch();
    await wait(100);
    sub_dir.create();
    await wait(100);
    sub_dir.delete();
    assert.deepEqual(
      [track[0]?.slice(0, 2), track[1]?.slice(0, 2), track[2]],
      [
        ["addDir", dir.path],
        ["addDir", sub_dir.path],
        ["unlinkDir", sub_dir.path],
      ]
    );
  });
});

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
