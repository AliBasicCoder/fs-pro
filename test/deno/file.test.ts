import {
  join,
  assertEquals,
  assert,
  existsSync,
  statSync,
  test,
  makeTempFileSync,
  readTextFileSync,
  writeTextFileSync,
  platform,
  tempDir,
  resources,
} from "./imports.ts";
import { File } from "../../src/file.ts";
import { Dir } from "../../src/dir.ts";
import { buffer } from "../../src/buffer.ts";
import { checkFileData, randomFile, customEqual } from "./shared.ts";

test({
  name: "File: have write data",
  fn() {
    const path = makeTempFileSync();
    const file = new File(path);
    checkFileData(file, path);
  },
});

test({
  name: "static File.tmpFile()",
  fn() {
    const file = File.tmpFile();
    assertEquals(existsSync(file.path), true);
  },
});

test({
  name: "File.create()",
  fn() {
    const tmp_dir = tempDir();
    const file = new File(tmp_dir, randomFile()).create();
    assertEquals(existsSync(file.path), true);
    // test defaultContent
    const file2 = new File(tmp_dir, randomFile());
    file2.defaultContent = "hello world";
    file2.create();
    assertEquals(existsSync(file2.path), true);
    assertEquals(readTextFileSync(file2.path), "hello world");
    // test defaultContent 2
    const file3 = new File(tmp_dir, randomFile()).create();
    file3.defaultContent = "hello world";
    file3.create();
    assertEquals(existsSync(file3.path), true);
    assertEquals(readTextFileSync(file3.path), "hello world");
  },
});

test({
  name: "File.exits()",
  fn() {
    const tmp_dir = tempDir();
    const file1 = File.tmpFile();
    assertEquals(existsSync(file1.path), file1.exits());
    const file2 = new File(tmp_dir, randomFile());
    assertEquals(existsSync(file2.path), file2.exits());
  },
});

test({
  name: "File.delete()",
  fn() {
    const file = File.tmpFile();
    file.delete();
    assertEquals(file.exits(), false);
  },
});

test({
  name: "File.read()",
  fn() {
    const file = File.tmpFile();
    writeTextFileSync(file.path, "hello world");
    assertEquals(file.read().toString(), "hello world");
  },
});

test({
  name: "File.read() -- complex",
  fn() {
    const file = File.tmpFile();
    file.write("hello world");
    assertEquals(file.read(6).toString(), "world");
    assertEquals(file.read(6, 3).toString(), "wor");
    assertEquals(file.read(undefined, 5).toString(), "hello");
  },
});

test({
  name: "File.text()",
  fn() {
    const file = File.tmpFile();
    writeTextFileSync(file.path, "hello world");
    assertEquals(file.text(), "hello world");
    assertEquals(file.text(6), "world");
    assertEquals(file.text(6, 3), "wor");
    assertEquals(file.text(undefined, 5), "hello");
  },
});

test({
  name: "File.overwrite()",
  fn() {
    const file = File.tmpFile();
    file.write("some\nline\nthing");
    let res = "";
    file.overwrite("\n", (str, i) => (res += `${i + 1}| ${str}\n`));
    assertEquals(res, "1| some\n2| line\n3| thing\n");
  },
});

test({
  name: "File.write() string",
  fn() {
    const file = File.tmpFile();
    file.write("hello world");
    assertEquals(file.read().toString(), "hello world");
  },
});

test({
  name: "File.write() Buffer",
  fn() {
    const Buffer = buffer.getBuffer();
    const file = File.tmpFile();
    file.write(Buffer.from("hello world"));
    assertEquals(file.read(), Buffer.from("hello world"));
  },
});

test({
  name: "File.write() json",
  fn() {
    const file = File.tmpFile();
    file.write({ hello: "world" });
    assertEquals(JSON.parse(file.read().toString()), { hello: "world" });
  },
});

test({
  name: "File.write() complex",
  fn() {
    const file = File.tmpFile();
    file.write("hello world");
    file.write("123", 2);
    assertEquals(file.text(), "he123 world");
    file.write("hello world");
    file.write("12345", 0, 3, 2);
    assertEquals(file.text(), "345lo world");
  },
});

test({
  name: "File.truncate()",
  fn() {
    const file = File.tmpFile().write("hello world");
    file.truncate();
    assertEquals(file.read().length, 0);
  },
});

test({
  name: "File.link()",
  fn() {
    const tmp_dir = tempDir();

    const file = File.tmpFile().write("hello world");
    const link = join(tmp_dir, randomFile());
    file.link(link);
    assertEquals(readTextFileSync(link), "hello world");
  },
});

test({
  name: "File.symlink()",
  fn() {
    const tmp_dir = tempDir();
    const file = File.tmpFile().write("hello world");
    const link = join(tmp_dir, randomFile());
    file.symlink(link);
    assertEquals(readTextFileSync(link), "hello world");
  },
});

test({
  name: "File.json()",
  fn() {
    const file = File.tmpFile();
    file.write({ hello: "world" });
    assertEquals(file.json(), { hello: "world" });
  },
});

test({
  name: "File.validate() and File.valid()",
  fn() {
    const file = File.tmpFile().write({ hello: "world" });
    let called = 0;
    file.validator = function () {
      called++;
      return JSON.parse(this.read().toString());
    };
    const errors = file.validate();
    assertEquals(errors.length, 0);
    assertEquals(called, 1);
    assertEquals(file.valid(), true);
  },
});

test({
  name: "File.getIndex() and File.getIndexBetween()",
  fn() {
    const file = File.tmpFile();
    file.write("this\nis\nsome\ntext");
    assertEquals(file.getIndex("\n", 1), "is");
    assertEquals(file.getIndexBetween("\n", 1), ["is", "some", "text"]);
    assertEquals(file.getIndexBetween("\n", 0, 2), ["this", "is"]);
  },
});

test({
  name: "File.append()",
  fn() {
    const file = File.tmpFile();
    file.write("hello ").append("world");
    assertEquals(file.read().toString(), "hello world");
  },
});

test({
  name: "File.splitBy()",
  fn() {
    const file = File.tmpFile().write("hello world");
    assertEquals(file.splitBy(" "), ["hello", "world"]);
  },
});

test({
  name: "File.stat()",
  fn() {
    const file = File.tmpFile();
    customEqual(file.stat(), statSync(file.path));
  },
});

test({
  name: "File.rename()",
  fn() {
    const tmp_dir = tempDir();

    const file = File.tmpFile().create();
    const new_name = randomFile();
    file.rename(new_name);
    checkFileData(file, tmp_dir, new_name);
    assertEquals(existsSync(file.path), true);
  },
});

test({
  name: "File.copyTo() destination only",
  fn() {
    const original_file = File.tmpFile().create();
    const dest_dir = Dir.tmpDir();

    const file_copy = original_file.copyTo(dest_dir.path);
    checkFileData(file_copy, dest_dir.path, original_file.base);
    assertEquals(file_copy.exits(), true);
  },
});

test({
  name: "File.copyTo() rename",
  fn() {
    const original_file = File.tmpFile().create();
    const dest_dir = Dir.tmpDir();

    const file_copy_base = randomFile();
    const file_copy = original_file.copyTo(dest_dir.path, file_copy_base);
    checkFileData(file_copy, dest_dir.path, file_copy_base);
    assertEquals(file_copy.exits(), true);
  },
});

test({
  name: "File.copyTo() isRelative",
  fn() {
    const original_file = File.tmpFile().create();
    const dest_dir = Dir.tmpDir();

    const file_copy = original_file.copyTo(dest_dir.name, null, true);
    checkFileData(file_copy, dest_dir.path, original_file.base);
    assertEquals(file_copy.exits(), true);
  },
});

test({
  name: "File.copyTo() isRelative and rename",
  fn() {
    const original_file = File.tmpFile().create();
    const dest_dir = Dir.tmpDir();
    const file_copy_base = randomFile();
    const file_copy = original_file.copyTo(dest_dir.name, file_copy_base, true);
    checkFileData(file_copy, dest_dir.path, file_copy_base);
    assertEquals(file_copy.exits(), true);
  },
});

test({
  name: "File.moveTo()",
  fn() {
    const file = File.tmpFile();
    const dist_dir = Dir.tmpDir();
    file.moveTo(dist_dir.path);
    checkFileData(file, dist_dir.path, file.base);
    assertEquals(existsSync(file.path), true);
  },
});

test({
  name: "File.open() and File.close()",
  ignore: platform === "node",
  fn() {
    const file = File.tmpFile();
    const fd = file.open();
    assertEquals(typeof fd, "number");
    assertEquals(resources()[fd], "fsFile");
    file.close();
    assertEquals(resources()[fd], undefined);
  },
});

test({
  name: "File.watch(), File.unwatch()",
  ignore: platform === "node",
  async fn() {
    const track: string[] = [];
    const file = File.tmpFile();
    file.watch((e: string, stats: any, path?: string) => {
      track.push(e);
      assert(!stats);
      assert(typeof path === "string");
    });
    await wait(100);
    file.write("hello world");
    await wait(100);
    file.unwatch();
    await wait(100);
    file.write("hello world2");
    await wait(100);
    // it looks like that watch behavior varies heavily across platforms
    // in deno so to make sure that it works on all platforms
    // the watch must be called at least twice
    // one for the start of the watch
    // and the other for the modification made
    // TODO: try to fix this
    assert(track.length >= 2);
  },
});

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
