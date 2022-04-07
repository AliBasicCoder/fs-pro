import {
  assertEquals,
  join,
  existsSync,
  statSync,
  makeTempDirSync,
  test,
  tempDir,
  platform,
  operating_system,
  assert,
  lstatSync,
} from "./imports.ts";
import { Dir } from "../src/dir.ts";
import { File } from "../src/file.ts";
import {
  checkDirData,
  randomDir,
  randomFile,
  checkFileData,
  fillArray,
  customEqual,
} from "./shared.ts";

test({
  name: "Dir: have write data",
  fn() {
    const path = makeTempDirSync();
    const dir = new Dir(path);
    checkDirData(dir, path);
  },
});

test({
  name: "static Dir.tmpDir()",
  fn() {
    const dir = Dir.tmpDir();
    assertEquals(dir.exits(), true);
    assertEquals(dir.parentDirectory, tempDir());
  },
});

test({
  name: "Dir.create()",
  fn() {
    const tmp_dir = tempDir();
    const dir = new Dir(tmp_dir, randomDir());
    dir.create();
    assertEquals(existsSync(dir.path), true);
  },
});

test({
  name: "Dir.exits()",
  fn() {
    const tmp_dir = tempDir();
    const dir = new Dir(tmp_dir, randomDir());
    assertEquals(dir.exits(), false);
    dir.create();
    assertEquals(dir.exits(), true);
  },
});

test({
  name: "Dir.delete()",
  fn() {
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
    assertEquals(dir.exits(), false);
  },
});

test({
  name: "Dir.delete() (empty folder)",
  fn() {
    const dir = Dir.tmpDir();
    dir.delete();
    assertEquals(dir.exits(), false);
  },
});

test({
  name: "Dir.createFile()",
  fn() {
    const dir = Dir.tmpDir();
    const file_base = randomFile();
    const file = dir.createFile(file_base);
    checkFileData(file, dir.path, file_base);
    assertEquals(file.exits(), true);
  },
});

test({
  name: "Dir.createFile() with createParents",
  fn() {
    const dir = Dir.tmpDir();
    const file_base = randomFile();
    const file = dir.createFile(`foo/bar/hi/bye/${file_base}`, true);
    checkFileData(file, dir.path, `foo/bar/hi/bye/${file_base}`);
    assertEquals(file.exits(), true);
  },
});

test({
  name: "Dir.createDir()",
  fn() {
    const dir = Dir.tmpDir();
    const subDir = dir.createDir(randomDir());
    checkDirData(subDir, dir.path, subDir.name);
    assertEquals(subDir.exits(), true);
  },
});

test({
  name: "Dir.createDir() with createParents",
  fn() {
    const dir = Dir.tmpDir();
    const subDir_base = randomDir();
    const subDir = dir.createDir(`foo/bar/${subDir_base}`, true);
    checkDirData(subDir, dir.path, "foo/bar", subDir.name);
    assertEquals(subDir.exits(), true);
  },
});

test({
  name: "Dir.getFile()",
  fn() {
    const dir = Dir.tmpDir();
    const file_base = randomFile();
    dir.createFile(file_base);
    const file = dir.getFile(file_base);
    checkFileData(file, dir.path, file_base);
  },
});

test({
  name: "Dir.getDir()",
  fn() {
    const dir = Dir.tmpDir();
    const newDir_name = randomDir();
    dir.createDir(newDir_name);
    const newDir = dir.getDir(newDir_name);
    checkDirData(newDir, dir.path, newDir_name);
  },
});

test({
  name: "Dir.read()",
  fn() {
    const dir = Dir.tmpDir();
    const sub_file = dir.createFile(randomFile());
    const sub_dir = dir.createDir(randomDir());
    try {
      assertEquals(dir.read(), [sub_file.base, sub_dir.name]);
    } catch (error) {
      assertEquals(dir.read(), [sub_dir.name, sub_file.base]);
    }
  },
});

test({
  name: "Dir.readResolve()",
  fn() {
    const dir = Dir.tmpDir();
    const sub_dir = dir.createDir(randomDir());
    const sub_file = dir.createFile(randomFile());
    try {
      assertEquals(dir.readResolve(), [sub_dir, sub_file]);
    } catch (error) {
      assertEquals(dir.readResolve(), [sub_file, sub_dir]);
    }
  },
});

test({
  name: "Dir.stat(), .lstat(), .lastAccessed, .lastModified, .lastChanged, .createdAt, .size",
  fn() {
    const dir = Dir.tmpDir();
    const expected = statSync(dir.path);
    customEqual(dir.stat(), expected);
    assertEquals(dir.lastAccessed, expected.atime);
    assertEquals(dir.lastModified, expected.mtime);
    assertEquals(dir.lastChanged, expected.ctime);
    assertEquals(dir.createdAt, expected.birthtime);
    assertEquals(dir.size, expected.size);
    customEqual(dir.lstat(), lstatSync(dir.path));
  },
});

test({
  name: "Dir.deleteMach()",
  fn() {
    const dir = Dir.tmpDir();
    const regex = /delete_.*/;
    const sub_dir = dir.createDir("delete_1");
    sub_dir.createFile("should_be_deleted");
    const sub_dir2 = dir.createDir("no_remove_1");
    const file2 = dir.createFile("delete_2");
    const file3 = dir.createFile("no_remove_2");
    dir.deleteMath(regex);
    assertEquals(sub_dir.exits(), false);
    assertEquals(sub_dir2.exits(), true);
    assertEquals(file2.exits(), false);
    assertEquals(file3.exits(), true);
  },
});

test({
  name: "Dir.deleteMatchFile()",
  fn() {
    const dir = Dir.tmpDir();
    const regex = /delete_.*/;
    const sub_dir = dir.createDir("delete_1");
    const file1 = sub_dir.createFile("delete_3");
    const sub_dir2 = dir.createDir("no_remove_1");
    const file2 = dir.createFile("delete_2");
    const file3 = dir.createFile("no_remove_2");
    dir.deleteMatchFile(regex);
    assertEquals(sub_dir.exits(), true);
    assertEquals(sub_dir2.exits(), true);
    assertEquals(file2.exits(), false);
    assertEquals(file3.exits(), true);
    assertEquals(file1.exits(), false);
  },
});

test({
  name: "Dir.deleteMatchDir()",
  fn() {
    const dir = Dir.tmpDir();
    const regex = /delete_.*/;
    const sub_dir = dir.createDir("delete_1");
    const file1 = sub_dir.createFile("delete_3");
    const sub_dir2 = dir.createDir("no_remove_1");
    const file2 = dir.createFile("delete_2");
    const file3 = dir.createFile("no_remove_2");
    dir.deleteMatchDir(regex);
    assertEquals(sub_dir.exits(), false);
    assertEquals(file1.exits(), false);
    assertEquals(sub_dir2.exits(), true);
    assertEquals(file2.exits(), true);
    assertEquals(file3.exits(), true);
  },
});

test({
  name: "Dir.rename()",
  fn() {
    const tmp_dir = tempDir();
    const dir = Dir.tmpDir();
    const old_name = dir.name;
    const new_name = randomDir();
    dir.rename(new_name);
    checkDirData(dir, tmp_dir, new_name);
    assertEquals(dir.exits(), true);
    assertEquals(existsSync(join(tmp_dir, old_name)), false);
  },
});

test({
  name: "Dir.forEach(), Dir.forEachFile(), Dir.forEachDir()",
  fn() {
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
    assertEquals(called, [
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
  },
});

test({
  name: "Dir.copyTo()",
  fn() {
    const tmp_dir = tempDir();
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
    checkDirData(newDir, tmp_dir, `${dir.name}_copied`);
    filesArr.forEach((item) => {
      assertEquals(newDir.getFile(item).exits(), true);
    });
  },
});

test({
  name: "Dir.moveTo()",
  fn() {
    const tmp_dir = tempDir();
    const dir = Dir.tmpDir();
    const old_dir_name = dir.name;
    const filesArr = [
      "some.txt",
      "some_dir/some.txt",
      "empty_dir",
      "foo/bar/hi/deep_file.txt",
      "foo/bar/hi/deep_empty_dir",
    ];
    filesArr.forEach((item) => dir.createFile(item, true));

    dir.moveTo("../", `${dir.name}_moved`, true);

    checkDirData(dir, tmp_dir, `${old_dir_name}_moved`);

    filesArr.forEach((item) => assertEquals(dir.getFile(item).exits(), true));
  },
});

test({
  name: "Dir.watch(), Dir.unwatch() -- node",
  ignore:
    platform === "deno" ||
    (platform === "node" && operating_system === "darwin"),
  async fn() {
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
    assertEquals(
      [track[0]?.slice(0, 2), track[1]?.slice(0, 2), track[2]],
      [
        ["addDir", dir.path],
        ["addDir", sub_dir.path],
        ["unlinkDir", sub_dir.path],
      ]
    );
  },
});

test({
  name: "Dir.watch(), Dir.unwatch() -- deno",
  ignore: platform === "node",
  async fn() {
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
    if (operating_system === "darwin") {
      // for some reason in macos create will be repeated twice
      // so
      assert(track.length >= 2);
    } else {
      assertEquals(track, [
        ["create", sub_dir.path],
        ["remove", sub_dir.path],
      ]);
    }
  },
});

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
