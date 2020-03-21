import { File } from "../src/index";
import * as assert from "assert";
import { join } from "path";
import { readFileSync } from "fs";

const fileIndex = (index: number) => `file_${index}`;

describe("File", () => {
  const file = new File(__dirname, fileIndex(0));

  it("have right data", done => {
    assert.equal(file.path, join(__dirname, fileIndex(0)));
    assert.equal(file.name, fileIndex(0));
    assert.equal(file.extension, "");
    assert.equal(file.base, fileIndex(0));
    assert.equal(file.root, "/");
    assert.equal(file.directory, __dirname);

    done();
  });

  it(".write()", done => {
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
    done();
  });
});
