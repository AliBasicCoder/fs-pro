import { join } from "https://deno.land/std@0.74.0/path/mod.ts";
import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts";
import { existsSync, statSync } from "https://deno.land/std@0.74.0/node/fs.ts";
import { Shape, Dir, File } from "../../mod.ts";

function existsAndType(...paths: string[]) {
  const path = join(...paths);
  const exists = existsSync(path);
  const isFile = exists ? statSync(path).isFile() : null;
  return [exists, isFile];
}

const shape = new Shape({
  some_file: Shape.File("some_file.txt"),
  some_dir: Shape.Dir("some_dir", {
    some_dir_2: Shape.Dir("some_dir_2", Shape.File("*.txt")),
    some_file_2: Shape.File("some_file_2"),
    __rest: Shape.File("*.txt"),
  }),
  some_dir_3: Shape.Dir("some_dir_3", Shape.File("*.txt")),
  __rest: Shape.File("rest[0-9]{3}.txt|*.any"),
});

Deno.test({
  name: "Shape.createShapeInst()",
  fn() {
    const target_dir = Dir.tmpDir();
    const shapeInstRef = shape.createShapeInst(target_dir.path);

    assertEquals(existsAndType(target_dir.path, "some_file.txt"), [true, true]);
    assertEquals(existsAndType(target_dir.path, "some_dir"), [true, false]);
    assertEquals(existsAndType(target_dir.path, "some_dir/some_dir_2"), [
      true,
      false,
    ]);
    assertEquals(existsAndType(target_dir.path, "some_dir_3"), [true, false]);
    assertEquals(existsAndType(target_dir.path, "some_dir/__rest"), [
      false,
      null,
    ]);
    assertEquals(existsAndType(target_dir.path, "__rest"), [false, null]);

    assertEquals(shapeInstRef.__dir instanceof Dir, true);
    assertEquals(shapeInstRef.some_file instanceof File, true);
    assertEquals(shapeInstRef.some_dir_3 instanceof Dir, true);
    assertEquals(shapeInstRef.some_dir.__dir instanceof Dir, true);
    assertEquals(shapeInstRef.some_dir.some_dir_2 instanceof Dir, true);
    assertEquals(shapeInstRef.some_dir.some_file_2 instanceof File, true);
  },
});

Deno.test({
  name: "Shape.validate() empty folder",
  fn() {
    const target_dir = Dir.tmpDir();
    assertEquals(shape.validate(target_dir.path).arr.length, 3);
  },
});

Deno.test({
  name: "Shape.validate() correct folder",
  fn() {
    const target_dir = Dir.tmpDir();
    shape.createShapeInst(target_dir.path);
    assertEquals(shape.validate(target_dir.path).arr.length, 0);
  },
});

Deno.test({
  name: "Shape.validate() __rest",
  fn() {
    const target_dir = Dir.tmpDir();
    shape.createShapeInst(target_dir.path);

    target_dir.createFile("rest100.txt");
    target_dir.createFile("foo12021bar.any");
    target_dir.getDir("some_dir").createFile("some_thing.txt");

    assertEquals(shape.validate(target_dir.path).arr.length, 0);
  },
});
