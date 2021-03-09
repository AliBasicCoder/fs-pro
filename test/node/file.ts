import * as assert from "assert";
import { Dir, File, FileType } from "./fs-pro";
import * as os from "os";
import {
  checkData,
  // isReadableStream,
  // isWritableStream,
  randomFile,
} from "./shared";
import { readFileSync, existsSync, statSync } from "fs";

describe("File", () => {
  it("have right data", () => {
    const file_base = randomFile();
    const file = new File(__dirname, file_base);
    checkData(file, file_base, __dirname);
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
    checkData(file, file.name, os.tmpdir());
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
    // @ts-ignore
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
    const file = File.tmpFile().create();
    assert.deepEqual(file.stat(), statSync(file.path));
  });

  it(".rename()", () => {
    const file = File.tmpFile().create();
    const new_name = randomFile();
    file.rename(new_name);
    checkData(file, new_name, os.tmpdir());
    assert.equal(existsSync(file.path), true);
  });

  it(".copyTo()", () => {
    const original_file = File.tmpFile().create();
    const dest_dir = Dir.tmpDir();

    const copy1 = original_file.copyTo(dest_dir.path);
    checkData(copy1, original_file.base, dest_dir.path);
    assert.equal(existsSync(copy1.path), true);
    copy1.delete();

    const copy2_base = randomFile();
    const copy2 = original_file.copyTo(dest_dir.path, copy2_base);
    checkData(copy2, copy2_base, dest_dir.path);
    assert.equal(existsSync(copy2.path), true);
    copy2.delete();

    const copy3 = original_file.copyTo(dest_dir.name, null, true);
    checkData(copy3, original_file.base, dest_dir.path);
    assert.equal(existsSync(copy3.path), true);
    copy3.delete();

    const copy4_base = randomFile();
    const copy4 = original_file.copyTo(dest_dir.name, copy4_base, true);
    checkData(copy4, copy4_base, dest_dir.path);
    assert.equal(existsSync(copy4.path), true);
  });

  it(".moveTo()", () => {
    const file = File.tmpFile();
    const dist_dir = Dir.tmpDir();
    file.moveTo(dist_dir.path);
    checkData(file, file.name, dist_dir.path);
    assert.equal(existsSync(file.path), true);
  });

  it(".open() .close()", () => {
    const file = File.tmpFile();
    const fd = file.open();
    assert.equal(typeof fd, "number");
    // TODO: find a way to see if it's open or not
    file.close();
  });

  it(".watch() .unwatch()", (done) => {
    if (process.platform === "darwin") {
      done();
      return;
    }
    let file: FileType;
    const track: any[] = [];
    new Promise((resolve) => {
      file = File.tmpFile();
      // @ts-ignore
      file.watch((e) => track.push(e));
      resolve(wait(100));
    })
      .then(() => {
        file.write("hello world");
        return wait(100);
      })
      .then(() => {
        file.unwatch();
        return wait(100);
      })
      .then(() => file.write("hello world2"))
      .then(() => {
        assert.deepEqual(track, ["add", "change"]);
        done();
      })
      .catch((err) => done(err));
  });
});

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
