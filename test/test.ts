/* eslint-disable no-console */
import { File, Dir, Model, Structure } from "../src/index";
import * as assert from "assert";
import { join } from "path";
import { existsSync } from "fs";

const modelBase = {
  dum1: {
    dum3: Model.File(".txt"),
    dum5: Model.Dir(Model.File(".txt")),
  },
  dum2: {
    dum4: Model.File(".txt"),
    dum6: Model.Dir(Model.File(".txt")),
  },
  file: Model.File(".txt", "hello world"),
};

describe("Modal", () => {
  const model = new Model(modelBase);

  it(".structure()", (done) => {
    const stuck = model.structure(__dirname, "test9");

    for (const key in modelBase) {
      // @ts-ignore
      const elem = modelBase[key];
      if (key !== "file") {
        const keys = Object.keys(elem);

        assert.equal(stuck[key][keys[0]] instanceof File, true);
        assert.equal(stuck[key][keys[1]] instanceof Dir, true);
      } else {
        assert.equal(stuck[key] instanceof File, true);
      }
    }
    done();
  });

  it(".createAt()", (done) => {
    const stuckPath = join(__dirname, "test10");
    model.createAt(stuckPath);

    assert.equal(existsSync(stuckPath), true);

    for (const key in modelBase) {
      // @ts-ignore
      const elem = modelBase[key];
      if (key !== "file") {
        const keys = Object.keys(elem);
        const file = new File(stuckPath, `${key}/${keys[0]}.txt`);
        const dir = new Dir(stuckPath, `${key}/${keys[1]}`);

        assert.equal(existsSync(file.path), true);
        assert.equal(existsSync(dir.path), true);
      } else {
        const file = new File(stuckPath, `${key}.txt`);
        assert.equal(existsSync(file.path), true);
        assert.equal(file.read().toString(), "hello world");
      }
    }
    new Dir(stuckPath).delete();
    done();
  });
  describe(".valid()", () => {
    it("a valid one", (done) => {
      const dir = new Dir(__dirname, "test11");
      model.createAt(dir.path);
      assert.equal(model.valid(dir.path), true);
      dir.delete();
      done();
    });
    it("an invalid one", (done) => {
      const dir = new Dir(__dirname, "test12").create();
      dir.createDir("dum3").createFile("dum34");
      assert.equal(model.valid(dir.path), false);
      dir.delete();
      done();
    });
  });
});

describe("Structure", () => {
  it(".create()", (done) => {
    const testDir = new Dir(__dirname, "test13");
    const model = new Model(modelBase);
    const stuck = model.structure<typeof modelBase>(testDir.path);
    const called = {
      onCreate: 0,
      onCreateFile: 0,
      onCreateDir: 0,
    };
    Structure.create(stuck, {
      onCreate() {
        called.onCreate++;
      },
      onCreateDir() {
        called.onCreateDir++;
      },
      onCreateFile() {
        called.onCreateFile++;
      },
    });
    assert.equal(existsSync(testDir.path), true);

    for (const key in modelBase) {
      // @ts-ignore
      const elem = modelBase[key];
      if (key !== "file") {
        const keys = Object.keys(elem);
        const file = new File(testDir.path, `${key}/${keys[0]}.txt`);
        const dir = new Dir(testDir.path, `${key}/${keys[1]}`);

        assert.equal(existsSync(file.path), true);
        assert.equal(existsSync(dir.path), true);
      } else {
        const file = new File(testDir.path, `${key}.txt`);
        assert.equal(existsSync(file.path), true);
        assert.equal(file.read().toString(), "hello world");
      }
    }
    assert.deepEqual(called, {
      onCreate: 8,
      onCreateDir: 5,
      onCreateFile: 3,
    });
    testDir.delete();
    done();
  });
});
