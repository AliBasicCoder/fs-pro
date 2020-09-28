import * as assert from "assert";
import { File, addPlugin } from "../../src/index";

it("addPlugin", (done) => {
  addPlugin({
    name: "xml",
    plugin: [
      {
        methodName: "xml",
        func: function () {
          return `the size is ${this.size}`;
        },
        // @ts-ignore
        className: "File",
        isStatic: false,
      },
      {
        methodName: "st",
        func: function () {
          return "hello there";
        },
        // @ts-ignore
        className: "File",
        isStatic: true,
      },
    ],
  });
  const file = new File("some_thing.txt").create();
  // @ts-ignore
  assert.equal(typeof file.xml, "function");
  // @ts-ignore
  assert.equal(file.xml(), "the size is 0");
  // @ts-ignore
  assert.equal(typeof File.st, "function");
  // @ts-ignore
  assert.equal(File.st(), "hello there");
  file.delete();
  done();
});
