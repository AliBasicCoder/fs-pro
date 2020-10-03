import * as assert from "assert";
import { Dir, File } from "../../src/index";
import * as os from "os";
import {
  checkData,
  isReadableStream,
  isWritableStream,
  randomFile,
} from "./shared";
import { readFileSync, existsSync, statSync, unlinkSync } from "fs";

describe("File", () => {
  it("have right data", (done) => {
    const file_base = randomFile();
    const file = new File(__dirname, file_base);
    checkData(file, file_base, __dirname);
    done();
  });

  it(".create()", (done) => {
    const file = new File(os.tmpdir(), randomFile());
    file.create();
    assert.equal(existsSync(file.path), true);
    unlinkSync(file.path);
    done();
  });

  it(".exits()", (done) => {
    const file = new File(os.tmpdir(), randomFile());
    assert.equal(file.exits(), existsSync(file.path));

    const file2 = new File(os.tmpdir(), randomFile());
    assert.equal(file2.exits(), existsSync(file2.path));
    done();
  });

  it(".delete()", (done) => {
    const file = new File(os.tmpdir(), randomFile()).create();
    file.delete();
    assert.equal(existsSync(file.path), false);
    done();
  });

  it("File.tmpFile()", (done) => {
    const file = File.tmpFile();
    checkData(file, file.name, os.tmpdir());
    done();
  });

  it(".write()", (done) => {
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
    file.delete();
    done();
  });

  it(".json()", (done) => {
    const file = File.tmpFile();
    file.write({ hello: "world" });
    assert.deepEqual(file.json(), { hello: "world" });
    file.delete();
    done();
  });

  it(".validate() and file.valid()", (done) => {
    const file = File.tmpFile().write({ hello: "world" });
    let called = 0;
    file.validator = function () {
      called++;
      return JSON.parse(this.read().toString());
    };
    file.validate();
    assert.equal(called, 1);
    assert.equal(file.valid(), true);
    file.delete();
    done();
  });

  it(".read()", (done) => {
    const file = File.tmpFile().write({ hello: "world" });
    assert.equal(file.read().toString(), JSON.stringify({ hello: "world" }));
    file.write("some\nline\nthing");
    let res = "";
    file.read("\n", (str, i) => (res += `${i + 1}| ${str}\n`));
    assert.equal(res, "1| some\n2| line\n3| thing\n");
    file.delete();
    done();
  });

  it(".overwrite()", (done) => {
    const file = File.tmpFile().write("some\nline\nthing");
    file.overwrite("\n", (str, i) => `${i + 1}| ${str}\n`);
    assert.equal(file.read().toString(), "1| some\n2| line\n3| thing\n");
    file.delete();
    done();
  });

  it(".getIndex()", (done) => {
    const file = File.tmpFile().write("1| some\n");
    assert.equal(file.getIndex("\n", 0), "1| some");
    file.delete();
    done();
  });

  it(".getIndexBetween()", (done) => {
    const file = File.tmpFile().write("1| some\n");
    assert.deepEqual(file.getIndexBetween("\n", 0, 1), ["1| some"]);
    file.delete();
    done();
  });

  it(".append()", (done) => {
    const file = File.tmpFile();
    file.write("hello ").append("world");
    assert.equal(file.read().toString(), "hello world");
    file.delete();
    done();
  });

  it(".splitBy()", (done) => {
    const file = File.tmpFile().write("hello world");
    assert.deepEqual(file.splitBy(" "), ["hello", "world"]);
    file.delete();
    done();
  });

  it(".stats()", (done) => {
    const file = File.tmpFile().create();
    assert.deepEqual(file.stat(), statSync(file.path));
    file.delete();
    done();
  });

  it(".rename()", (done) => {
    const file = File.tmpFile().create();
    const new_name = randomFile();
    file.rename(new_name);
    checkData(file, new_name, os.tmpdir());
    assert.equal(existsSync(file.path), true);
    file.delete();
    done();
  });

  it(".copyTo()", (done) => {
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
    copy4.delete();

    dest_dir.delete();
    original_file.delete();
    done();
  });

  it(".moveTo()", (done) => {
    const file = File.tmpFile();
    const dist_dir = Dir.tmpDir();
    file.moveTo(dist_dir.path);
    checkData(file, file.name, dist_dir.path);
    assert.equal(existsSync(file.path), true);
    dist_dir.delete();
    done();
  });

  it(".createReadStream()", (done) => {
    const file = File.tmpFile();
    const stream = file.createReadStream();
    assert.equal(isReadableStream(stream), true);
    stream.close();
    file.delete();
    done();
  });

  it(".createWriteStream()", (done) => {
    const file = File.tmpFile();
    const stream = file.createWriteStream();
    assert.equal(isWritableStream(stream), true);
    stream.close();
    file.delete();
    done();
  });

  it(".watch() .unwatch()", (done) => {
    // skipping macos
    if (process.platform === "darwin") {
      done();
      return;
    }
    const file = File.tmpFile();
    const track: any[] = [];
    file.watch((e) => track.push(e));
    wait(100)
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
      });
  });
});

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
