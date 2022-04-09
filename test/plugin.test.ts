import { assertEquals, assertThrows, assert, test } from "./imports.ts";
import {
  addPlugin,
  getPluginTrack,
  getPluginTrackFormatted,
} from "../src/pluginAdder.ts";
import { File } from "../src/file.ts";
import { Plugin } from "../src/types.ts";
import { Dir } from "../src/dir.ts";

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
          className: "Dir",
          isStatic: true,
        },
      ],
    });
    const file = File.tmpFile();
    // @ts-ignore: access added functions
    assertEquals(typeof file.xml, "function");
    // @ts-ignore: access added functions
    assertEquals(file.xml(), "the size is 0");
    // @ts-ignore: access added functions
    assertEquals(typeof Dir.st, "function");
    // @ts-ignore: access added functions
    assertEquals(Dir.st(), "hello there");
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
    } catch (_) {
      assert(true);
    }
  },
});

test({
  name: "requires, getPluginTrack, getPluginTrackFormatted",
  fn() {
    const plugin1: Plugin = {
      name: "plugin_1",
      plugin: [
        {
          className: "File",
          isStatic: false,
          methodName: "one",
          func() {
            return true;
          },
        },
      ],
    };
    addPlugin({
      requires: [plugin1],
      name: "plugin_2",
      plugin: [
        {
          className: "File",
          isStatic: false,
          methodName: "two",
          func() {
            // @ts-ignore: added by plugin 1
            return [this.one(), true];
          },
        },
      ],
    });
    const file = File.tmpFile();

    // @ts-ignore: added by plugin 1
    assertEquals(file.one(), true);
    // @ts-ignore: added by plugin 2
    assertEquals(file.two(), [true, true]);

    addPlugin({
      requires: [plugin1],
      name: "plugin_3",
      plugin: [
        {
          className: "File",
          isStatic: false,
          methodName: "three",
          func() {
            // @ts-ignore: added by plugin 1
            return [this.one(), true];
          },
        },
      ],
    });
    // @ts-ignore: added by plugin 3
    assertEquals(file.three(), [true, true]);

    assert(Array.isArray(getPluginTrack()));
    assert(Array.isArray(getPluginTrackFormatted()));
    assert(Array.isArray(getPluginTrackFormatted(true)));
  },
});
