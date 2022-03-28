import { join, assertEquals, existsSync, statSync, test } from "./imports.ts";
import { Dir } from "../../src/dir.ts";
import { File } from "../../src/file.ts";
import { Shape, __rest } from "../../src/Shape.ts";

/** ET stands for Existence and Type */
function ET(...paths: string[]) {
  const path = join(...paths);
  const exists = existsSync(path);
  const isFile = exists ? statSync(path).isFile() : null;
  return [exists, isFile];
}

const shape = new Shape({
  some_file: Shape.File("some_file.txt", "hello world"),
  some_dir: Shape.Dir("some_dir", {
    some_dir_2: Shape.Dir("some_dir_2", Shape.File("*.txt")),
    some_file_2: Shape.File("some_file_2"),
    __rest: Shape.File("*.txt"),
  }),
  some_dir_3: Shape.Dir("some_dir_3", Shape.File("*.txt")),
  __rest: Shape.File("rest[0-9]{3}.txt|*.any"),
});

const shape2 = new Shape({
  some_file: Shape.File("some_file.txt", "hello world"),
  some_dir: Shape.Dir("some_dir", {
    some_dir_2: Shape.Dir("some_dir_2", Shape.Pattern("*.txt")),
    some_file_2: Shape.File("some_file_2"),
    [__rest]: Shape.Pattern("*.txt"),
  }),
  some_dir_3: Shape.Dir("some_dir_3", Shape.File("*.txt")),
  [__rest]: Shape.Pattern("rest[0-9]{3}.txt|*.any"),
});

const shape3 = new Shape({
  [__rest]: {
    [__rest]: Shape.Pattern("*.txt|*.text", undefined, function () {
      if (this.text() !== "hello world") {
        throw new Error();
      }
    }),
  },
});

test({
  name: "Shape.createShapeInst()",
  fn() {
    [shape, shape2].forEach((s) => {
      const target_dir = Dir.tmpDir();
      const called = [0, 0, 0];
      const shapeInstRef = s.createShapeInst(target_dir.path, {
        onCreate: () => called[0]++,
        onCreateFile: () => called[1]++,
        onCreateDir: () => called[2]++,
      });

      assertEquals(ET(target_dir.path, "some_file.txt"), [true, true]);
      assertEquals(ET(target_dir.path, "some_dir"), [true, false]);
      assertEquals(ET(target_dir.path, "some_dir/some_dir_2"), [true, false]);
      assertEquals(ET(target_dir.path, "some_dir_3"), [true, false]);
      assertEquals(ET(target_dir.path, "some_dir/__rest"), [false, null]);
      assertEquals(ET(target_dir.path, "__rest"), [false, null]);

      assertEquals(shapeInstRef.__dir instanceof Dir, true);
      assertEquals(shapeInstRef.some_file instanceof File, true);
      assertEquals(shapeInstRef.some_dir_3 instanceof Dir, true);
      assertEquals(shapeInstRef.some_dir.__dir instanceof Dir, true);
      assertEquals(shapeInstRef.some_dir.some_dir_2 instanceof Dir, true);
      assertEquals(shapeInstRef.some_dir.some_file_2 instanceof File, true);
      assertEquals(shapeInstRef.some_file.text(), "hello world");
      assertEquals(called, [6, 2, 4]);
    });
  },
});

test({
  name: "Shape.validate() empty folder",
  fn() {
    [shape, shape2].forEach((s) => {
      const target_dir = Dir.tmpDir();
      assertEquals(s.validate(target_dir.path).arr.length, 3);
    });
  },
});

test({
  name: "Shape.validate() correct folder",
  fn() {
    [shape, shape2].forEach((s) => {
      const target_dir = Dir.tmpDir();
      s.createShapeInst(target_dir.path);
      assertEquals(s.validate(target_dir.path).arr.length, 0);
    });
  },
});

test({
  name: "Shape.validate() __rest",
  fn() {
    [shape, shape2].forEach((s) => {
      const target_dir = Dir.tmpDir();
      s.createShapeInst(target_dir.path);

      target_dir.createFile("rest100.txt");
      target_dir.createFile("foo12021bar.any");
      target_dir.getDir("some_dir").createFile("some_thing.txt");

      assertEquals(s.validate(target_dir.path).arr.length, 0);
    });
  },
});

test({
  name: "Shape.validate() __rest 2",
  fn() {
    const dir = Dir.tmpDir();
    const sub_dir = dir.createDir("something");
    sub_dir.createFile("hi.txt").write("hello world");
    sub_dir.createFile("hi.text").write("hello world");

    assertEquals(shape3.validate(dir.path).arr.length, 0);

    const dir2 = Dir.tmpDir();
    const sub_dir2 = dir2.createDir("something2");
    sub_dir2.createFile("hi.txt");
    sub_dir2.createFile("hi.text").write("hello world");
    sub_dir2.createFile("hi");
    assertEquals(shape3.validate(dir2.path).arr.length, 2);
  },
});
