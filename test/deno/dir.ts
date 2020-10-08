import { assertEquals } from "https://deno.land/std@0.73.0/testing/asserts.ts";
import { parse, join } from "https://deno.land/std@0.73.0/path/mod.ts";
import { existsSync } from "https://deno.land/std@0.73.0/node/fs.ts";
import { Dir, File } from "../../mod.ts";
import {
  checkDirData,
  randomDir,
  randomFile,
  checkFileData,
  fillArray,
} from "./shared.ts";

const tmp_dir: string = parse(Deno.makeTempDirSync()).dir;

Deno.test({
  name: "Dir: have write data",
  fn() {
    const path = Deno.makeTempDirSync();
    const dir = new Dir(path);
    checkDirData(dir, path);
  },
});

Deno.test({
  name: "Dir.create()",
  fn() {
    const dir = new Dir(tmp_dir, randomDir());
    dir.create();
    assertEquals(existsSync(dir.path), true);
  },
});

Deno.test({
  name: "Dir.exits()",
  fn() {
    const dir = new Dir(tmp_dir, randomDir());
    assertEquals(dir.exits(), false);
  },
});

Deno.test({
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

Deno.test({
  name: "Dir.delete() (empty folder)",
  fn() {
    const dir = Dir.tmpDir();
    dir.delete();
    assertEquals(dir.exits(), false);
  },
});

Deno.test({
  name: "Dir.createFile()",
  fn() {
    const dir = Dir.tmpDir();
    const file_base = randomFile();
    const file = dir.createFile(file_base);
    checkFileData(file, join(dir.path, file_base));
    assertEquals(file.exits(), true);
  },
});

Deno.test({
  name: "Dir.createFile() with createParents",
  fn() {
    const dir = Dir.tmpDir();
    const file_base = randomFile();
    const file = dir.createFile(`foo/bar/hi/bye/${file_base}`, true);
    checkFileData(file, join(dir.path, `foo/bar/hi/bye/${file_base}`));
    assertEquals(file.exits(), true);
  },
});

Deno.test({
  name: "Dir.createDir()",
  fn() {
    const dir = Dir.tmpDir();
    const subDir = dir.createDir(randomDir());
    checkDirData(subDir, join(dir.path, subDir.name));
    assertEquals(subDir.exits(), true);
  },
});

Deno.test({
  name: "Dir.createDir() with createParents",
  fn() {
    const dir = Dir.tmpDir();
    const subDir_base = randomDir();
    const subDir = dir.createDir(`foo/bar/${subDir_base}`, true);
    checkDirData(subDir, join(dir.path, "foo/bar", subDir.name));
    assertEquals(subDir.exits(), true);
  },
});

Deno.test({
  name: "Dir.getFile()",
  fn() {
    const dir = Dir.tmpDir();
    const file_base = randomFile();
    dir.createFile(file_base);
    const file = dir.getFile(file_base);
    checkFileData(file, join(dir.path, file_base));
  },
});

Deno.test({
  name: "Dir.getDir()",
  fn() {
    const dir = Dir.tmpDir();
    const newDir_name = randomDir();
    dir.createDir(newDir_name);
    const newDir = dir.getDir(newDir_name);
    checkDirData(newDir, join(dir.path, newDir_name));
  },
});

Deno.test({
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

Deno.test({
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

// ignoring stats for now

Deno.test({
  name: "Dir.deleteMach()",
  fn() {
    // TODO: improve this testing
    const dir = Dir.tmpDir();
    const sub_dir = dir.createDir(randomDir());
    dir.deleteMath(RegExp(sub_dir.name));
    assertEquals(sub_dir.exits(), false);
  },
});

Deno.test({
  name: "Dir.deleteMatchFile()",
  fn() {
    // TODO: improve this testing
    const dir = Dir.tmpDir();
    const sub_file = dir.createFile(randomFile());
    dir.deleteMatchFile(RegExp(sub_file.base));
    assertEquals(sub_file.exits(), false);
  },
});

Deno.test({
  name: "Dir.deleteMatchDir()",
  fn() {
    const dir = Dir.tmpDir();
    const sub_dir = dir.createDir(randomDir());
    dir.deleteMatchDir(RegExp(sub_dir.name));
    assertEquals(sub_dir.exits(), false);
  },
});

Deno.test({
  name: "Dir.rename()",
  fn() {
    const dir = Dir.tmpDir();
    const old_name = dir.name;
    const new_name = randomDir();
    dir.rename(new_name);
    checkDirData(dir, join(tmp_dir, new_name));
    assertEquals(existsSync(join(tmp_dir, new_name)), true);
    assertEquals(existsSync(join(tmp_dir, old_name)), false);
  },
});

Deno.test({
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

Deno.test({
  name: "Dir.copyTo()",
  fn() {
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
    checkDirData(newDir, join(tmp_dir, `${dir.name}_copied`));
    filesArr.forEach((item) => {
      assertEquals(newDir.getFile(item).exits(), true);
    });
  },
});

Deno.test({
  name: "Dir.moveTo()",
  fn() {
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
    checkDirData(dir, join(tmp_dir, `${old_dir_name}_moved`));
    filesArr.forEach((item) => {
      assertEquals(dir.getFile(item).exits(), true);
    });
  }
});

// ignoring .watch() .unwatch() for now
