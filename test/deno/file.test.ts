import { parse, join } from "https://deno.land/std@0.74.0/path/mod.ts";
import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts";
import { existsSync } from "https://deno.land/std@0.74.0/node/fs.ts";
import { File, Buffer, Dir } from "../../mod.ts";
import { checkFileData, randomFile } from "./shared.ts";

const tmp_dir: string = parse(Deno.makeTempDirSync()).dir;

Deno.test({
  name: "File: have write data",
  fn() {
    const path = Deno.makeTempFileSync();
    const file = new File(path);
    checkFileData(file, path);
  },
});

Deno.test({
  name: "static File.tmpFile()",
  fn() {
    const file = File.tmpFile();
    assertEquals(existsSync(file.path), true);
  },
});

Deno.test({
  name: "File.create()",
  fn() {
    const file = new File(tmp_dir, randomFile()).create();
    assertEquals(existsSync(file.path), true);
  },
});

Deno.test({
  name: "File.exits()",
  fn() {
    const file1 = File.tmpFile();
    assertEquals(existsSync(file1.path), file1.exits());

    const file2 = new File(tmp_dir, randomFile());
    assertEquals(existsSync(file2.path), file2.exits());
  },
});

Deno.test({
  name: "File.delete()",
  fn() {
    const file = File.tmpFile();
    file.delete();
    assertEquals(file.exits(), false);
  },
});

Deno.test({
  name: "File.read()",
  fn() {
    const file = File.tmpFile();
    Deno.writeTextFileSync(file.path, "hello world");
    assertEquals(file.read().toString(), "hello world");
  },
});

Deno.test({
  name: "File.text()",
  fn() {
    const file = File.tmpFile();
    Deno.writeTextFileSync(file.path, "hello world");
    assertEquals(file.text(), "hello world");
  },
});

Deno.test({
  name: "File.overwrite()",
  fn() {
    const file = File.tmpFile();
    file.write("some\nline\nthing");
    let res = "";
    file.overwrite("\n", (str, i) => (res += `${i + 1}| ${str}\n`));
    assertEquals(res, "1| some\n2| line\n3| thing\n");
  },
});

Deno.test({
  name: "File.write() string",
  fn() {
    const file = File.tmpFile();
    file.write("hello world");
    assertEquals(file.read().toString(), "hello world");
  },
});

Deno.test({
  name: "File.write() Buffer",
  fn() {
    const file = File.tmpFile();
    file.write(Buffer.from("hello world"));
    assertEquals(file.read(), Buffer.from("hello world"));
  },
});

Deno.test({
  name: "File.write() json",
  fn() {
    const file = File.tmpFile();
    file.write({ hello: "world" });
    assertEquals(JSON.parse(file.read().toString()), { hello: "world" });
  },
});

Deno.test({
  name: "File.json()",
  fn() {
    const file = File.tmpFile();
    file.write({ hello: "world" });
    assertEquals(file.json(), { hello: "world" });
  },
});

Deno.test({
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

// ignoring .getIndex and .getIndexBetween

Deno.test({
  name: "File.append()",
  fn() {
    const file = File.tmpFile();
    file.write("hello ").append("world");
    assertEquals(file.read().toString(), "hello world");
  },
});

Deno.test({
  name: "File.splitBy()",
  fn() {
    const file = File.tmpFile().write("hello world");
    assertEquals(file.splitBy(" "), ["hello", "world"]);
  },
});

// ignoring .stats for now

Deno.test({
  name: "File.rename()",
  fn() {
    const file = File.tmpFile().create();
    const new_name = randomFile();
    file.rename(new_name);
    checkFileData(file, join(tmp_dir, new_name));
    assertEquals(existsSync(file.path), true);
  },
});

Deno.test({
  name: "File.copyTo() destination only",
  fn() {
    const original_file = File.tmpFile().create();
    const dest_dir = Dir.tmpDir();

    const file_copy = original_file.copyTo(dest_dir.path);
    checkFileData(file_copy, join(dest_dir.path, original_file.base));
    assertEquals(file_copy.exits(), true);
  },
});

Deno.test({
  name: "File.copyTo() rename",
  fn() {
    const original_file = File.tmpFile().create();
    const dest_dir = Dir.tmpDir();

    const file_copy_base = randomFile();
    const file_copy = original_file.copyTo(dest_dir.path, file_copy_base);
    checkFileData(file_copy, join(dest_dir.path, file_copy_base));
    assertEquals(file_copy.exits(), true);
  },
});

Deno.test({
  name: "File.copyTo() isRelative",
  fn() {
    const original_file = File.tmpFile().create();
    const dest_dir = Dir.tmpDir();

    const file_copy = original_file.copyTo(dest_dir.name, null, true);
    checkFileData(file_copy, join(dest_dir.path, original_file.base));
    assertEquals(file_copy.exits(), true);
  },
});

Deno.test({
  name: "File.copyTo() isRelative and rename",
  fn() {
    const original_file = File.tmpFile().create();
    const dest_dir = Dir.tmpDir();
    const file_copy_base = randomFile();
    const file_copy = original_file.copyTo(dest_dir.name, file_copy_base, true);
    checkFileData(file_copy, join(dest_dir.path, file_copy_base));
    assertEquals(file_copy.exits(), true);
  },
});

Deno.test({
  name: "File.moveTo()",
  fn() {
    const file = File.tmpFile();
    const dist_dir = Dir.tmpDir();
    file.moveTo(dist_dir.path);
    checkFileData(file, join(dist_dir.path, file.base));
    assertEquals(existsSync(file.path), true);
  },
});

Deno.test({
  name: "File.open() and File.close()",
  fn() {
    const file = File.tmpFile();
    const fd = file.open();
    assertEquals(typeof fd, "number");
    assertEquals(Deno.resources()[fd], "fsFile");
    file.close();
    assertEquals(Deno.resources()[fd], undefined);
  },
});

// ignoring .watch() .unwatch() for now
