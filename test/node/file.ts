import * as assert from "assert";
import { Dir, File } from "./fs-pro";
import * as os from "os";
import { checkFileData, randomFile } from "./shared";
import { readFileSync, existsSync, statSync, writeSync, readSync } from "fs";

describe("File", () => {
  it("have right data", () => {
    const file_base = randomFile();
    const file = new File(__dirname, file_base);
    checkFileData(file, __dirname, file_base);
  });

  it(".create()", () => {
    const file = new File(os.tmpdir(), randomFile());
    file.create();
    assert.equal(existsSync(file.path), true);
  });

  it(".exits()", () => {
    const file = new File(os.tmpdir(), randomFile());
    assert.equal(file.exits(), false);
    file.create();
    assert.equal(file.exits(), true);
  });

  it(".delete()", () => {
    const file = new File(os.tmpdir(), randomFile()).create();
    file.delete();
    assert.equal(existsSync(file.path), false);
  });

  it("File.tmpFile()", () => {
    const file = File.tmpFile();
    assert.equal(file.directory, os.tmpdir());
    assert.equal(file.exits(), true);
  });

  it(".write()", () => {
    const file = File.tmpFile();
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
    // complex writes
    file.write("hello world");
    file.write("123", 2);
    assert.equal(file.text(), "he123 world");
    file.write("hello world");
    file.write("12345", 0, 3, 2);
    assert.equal(file.text(), "345lo world");
  });

  it(".json()", () => {
    const file = File.tmpFile();
    file.write({ hello: "world" });
    assert.deepEqual(file.json(), { hello: "world" });
  });

  it(".validate() and file.valid()", () => {
    const file = File.tmpFile().write({ hello: "world" });
    let called = 0;
    file.validator = function () {
      called++;
      return JSON.parse(this.read().toString());
    };
    file.validate();
    assert.equal(called, 1);
    assert.equal(file.valid(), true);
  });

  it(".read()", () => {
    const file = File.tmpFile().write({ hello: "world" });
    assert.equal(file.read().toString(), JSON.stringify({ hello: "world" }));
    // complex
    file.write("hello world");
    assert.equal(file.read(6).toString(), "world");
    assert.equal(file.read(6, 3).toString(), "wor");
    assert.equal(file.read(0, 5).toString(), "hello");
  });

  it(".text()", () => {
    const file = File.tmpFile().write("hello world");
    assert.equal(file.text(), "hello world");
    assert.equal(file.text(), "hello world");
    assert.equal(file.text(6), "world");
    assert.equal(file.text(6, 3), "wor");
    assert.equal(file.text(0, 5), "hello");
  });

  it(".overwrite()", () => {
    const file = File.tmpFile().write("some\nline\nthing");
    file.overwrite("\n", (str, i) => `${i + 1}| ${str}\n`);

    assert.equal(file.read().toString(), "1| some\n2| line\n3| thing\n");
  });

  it(".getIndex()", () => {
    const file = File.tmpFile().write("1| some\n");

    assert.equal(file.getIndex("\n", 0), "1| some");
  });

  it(".getIndexBetween()", () => {
    const file = File.tmpFile().write("1| some\n");

    assert.deepEqual(file.getIndexBetween("\n", 0, 1), ["1| some"]);
  });

  it(".append()", () => {
    const file = File.tmpFile();
    file.write("hello ").append("world");
    assert.equal(file.read().toString(), "hello world");
  });

  it(".splitBy()", () => {
    const file = File.tmpFile().write("hello world");
    assert.deepEqual(file.splitBy(" "), ["hello", "world"]);
  });

  it(".stat()", () => {
    const file = File.tmpFile();
    assert.deepEqual(file.stat(), statSync(file.path));
  });

  it(".rename()", () => {
    const file = File.tmpFile();
    const old_path = file.path;
    const new_name = randomFile();
    file.rename(new_name);
    checkFileData(file, os.tmpdir(), new_name);
    assert.equal(file.exits(), true);
    assert.equal(existsSync(old_path), false);
  });

  it(".copyTo()", () => {
    const file = File.tmpFile();
    const dest = Dir.tmpDir();

    const copy1 = file.copyTo(dest.path);
    checkFileData(copy1, dest.path, file.base);
    assert.equal(copy1.exits(), true);

    const copy2_base = randomFile();
    const copy2 = file.copyTo(dest.path, copy2_base);
    checkFileData(copy2, dest.path, copy2_base);
    assert.equal(copy2.exits(), true);

    const copy3 = file.copyTo(dest.name, null, true);
    checkFileData(copy3, dest.path, file.base);
    assert.equal(copy3.exits(), true);

    const copy4_base = randomFile();
    const copy4 = file.copyTo(dest.name, copy4_base, true);
    checkFileData(copy4, dest.path, copy4_base);
    assert.equal(copy4.exits(), true);
  });

  it(".moveTo()", () => {
    const file = File.tmpFile();
    const dist = Dir.tmpDir();
    file.moveTo(dist.path);
    checkFileData(file, dist.path, file.name);
    assert.equal(existsSync(file.path), true);
  });

  it(".open() .close()", () => {
    const file = File.tmpFile();
    const fd = file.open("r+");
    assert.equal(typeof fd, "number");
    const block = () => {
      writeSync(fd, Buffer.from("hello world"));
      const result = Buffer.alloc(11);
      readSync(fd, result, 0, 11, 0);
      assert.equal(result.toString(), "hello world");
    };
    assert.doesNotThrow(block);
    file.close();
    assert.throws(block);
  });

  it(".watch() .unwatch()", async () => {
    if (process.platform === "darwin") return;
    const track: string[] = [];
    const file = File.tmpFile();
    file.watch((e) => track.push(e));
    await wait(100);
    file.write("hello world");
    await wait(100);
    file.unwatch();
    await wait(100);
    file.write("hello world2");
    await wait(100);
    assert.deepEqual(track, ["add", "change"]);
  });
});

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
