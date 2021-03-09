import * as assert from "assert";
import { File, addPlugin } from "./fs-pro";
import * as os from "os";

describe("addPlugin", () => {
  it("addPlugin normal plugin", () => {
    addPlugin({
      name: "xml",
      plugin: [
        {
          methodName: "xml",
          // @ts-ignore
          func: function () {
            // @ts-ignore
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
    const file = new File(os.tmpdir(), "some_thing.txt").create();
    // @ts-ignore
    assert.equal(typeof file.xml, "function");
    // @ts-ignore
    assert.equal(file.xml(), "the size is 0");
    // @ts-ignore
    assert.equal(typeof File.st, "function");
    // @ts-ignore
    assert.equal(File.st(), "hello there");
  });

  it("errors when overwriting native methods", () => {
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
  });

  it("errors when overwriting methods added by other plugins", () => {
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
  });

  it("allow overwriting methods added by other plugins when set to true", () => {
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
  });
});
