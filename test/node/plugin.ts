import * as assert from "assert";
import { File, addPlugin } from "../../src/index";

it("addPlugin normal plugin", (done) => {
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

it("errors when overwriting native methods", (done) => {
  assert.throws(() => {
    addPlugin({
      name: "test",
      plugin: [
        {
          className: "File",
          methodName: "write",
          isStatic: false,
          func() {},
        },
      ],
    });
  });
  done();
});

it("errors when overwriting methods added by other plugins", (done) => {
  assert.throws(() => {
    addPlugin({
      name: "test_2",
      plugin: [
        {
          className: "File",
          methodName: "xml",
          isStatic: false,
          func() {},
        },
      ],
    });
  });
  done();
});

it("allow overwriting methods added by other plugins when set to true", (done) => {
  assert.doesNotThrow(() => {
    addPlugin(
      {
        name: "test_2",
        plugin: [
          {
            className: "File",
            methodName: "xml",
            isStatic: false,
            func() {},
          },
        ],
      },
      true
    );
  });
  done();
});
