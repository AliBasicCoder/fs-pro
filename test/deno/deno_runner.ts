import "./dir.test.ts";
import "./file.test.ts";
import "./plugin.test.ts";
import "./shape.test.ts";
import { setImports, tests } from "./imports.ts";

async function load_deno() {
  const [fs, assert, path] = await Promise.all([
    import("https://deno.land/std@0.131.0/node/fs.ts"),
    import("https://deno.land/std@0.131.0/testing/asserts.ts"),
    import("https://deno.land/std@0.131.0/path/mod.ts"),
  ]);
  setImports({
    assertEquals: assert.assertEquals,
    assert: assert.assert,
    assertThrows: assert.assertThrows,
    join: path.join,
    parse: path.parse,
    existsSync: fs.existsSync,
    statSync: fs.statSync,
    makeTempFileSync: Deno.makeTempFileSync,
    makeTempDirSync: Deno.makeTempDirSync,
    readTextFileSync: Deno.readTextFileSync,
    writeTextFileSync: Deno.writeTextFileSync,
    resources: Deno.resources,
    tempDir: () => {
      // copied from https://deno.land/x/temp_dir@v1.0.0/mod.ts
      const getDirectory = () => {
        if (Deno.build.os === "windows") {
          return (
            Deno.env.get("TMP") ||
            Deno.env.get("TEMP") ||
            Deno.env.get("USERPROFILE") ||
            Deno.env.get("SystemRoot") ||
            ""
          );
        }

        return Deno.env.get("TMPDIR") || "/tmp";
      };

      return Deno.realPathSync(getDirectory());
    },
  });
  for (const test_ of tests) {
    Deno.test({
      name: test_.name,
      fn: () => test_.fn(),
    });
  }
}

load_deno();
