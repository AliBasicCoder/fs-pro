import { assertEquals, assertThrows, assert, test } from "./imports.ts";
import { addPlugin } from "../src/pluginAdder.ts";
import { File } from "../src/file.ts";

test({
  name: "addPlugin: addPlugin normal plugin",
  fn() {
    addPlugin({
      name: "xml",
      plugin: [
        {
          methodName: "xml",
          func: function () {
            return `the size is ${this.size}`;
          },
          className: "File",
          isStatic: false,
        },
        {
          methodName: "st",
          func: function () {
            return "hello there";
          },
          className: "File",
          isStatic: true,
        },
      ],
    });
    const file = File.tmpFile();
    // @ts-ignore
    assertEquals(typeof file.xml, "function");
    // @ts-ignore
    assertEquals(file.xml(), "the size is 0");
    // @ts-ignore
    assertEquals(typeof File.st, "function");
    // @ts-ignore
    assertEquals(File.st(), "hello there");
  },
});

test({
  name: "addPlugin: errors when overwriting native methods",
  fn() {
    assertThrows(() => {
      addPlugin({
        name: "test",
        plugin: [
          {
            className: "File",
            methodName: "overwrite",
            isStatic: false,
            func() {},
          },
        ],
      });
    });
  },
});

test({
  name: "addPlugin: errors when overwriting methods added by other plugins",
  fn() {
    assertThrows(() => {
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
  },
});

test({
  name: "addPlugin: allow overwriting methods added by other plugins when set to true",
  fn() {
    try {
      addPlugin(
        {
          name: "test_3",
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
    } catch (error) {
      assert(true);
    }
  },
});
