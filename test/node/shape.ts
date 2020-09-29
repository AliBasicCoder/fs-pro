import * as assert from "assert";
import { existsSync, statSync } from "fs";
import { join } from "path";
import { Dir, Shape, File } from "../../src/index";

function existsAndType(...paths: string[]) {
  const path = join(...paths);
  const exists = existsSync(path);
  const isFile = exists ? statSync(path).isFile() : null;
  return [exists, isFile];
}

describe("Shape", () => {
  const shape = new Shape({
    some_file: Shape.File("some_file.txt"),
    // @ts-ignore
    some_dir: {
      some_dir_2: Shape.Dir("some_dir_2", Shape.File("*.txt")),
      some_file_2: Shape.File("some_file_2"),
      __rest: Shape.File("*.txt"),
      __name: "some_dir",
    },
    some_dir_3: Shape.Dir("some_dir_3", Shape.File("*.txt")),
    __rest: Shape.File("rest[0-9]{3}.txt|*.any"),
  });

  it(".createShapeInst", (done) => {
    const target_dir = Dir.tmpDir();
    const shapeInstRef = shape.createShapeInst(target_dir.path);

    assert.deepEqual(existsAndType(target_dir.path, "some_file.txt"), [
      true,
      true,
    ]);
    assert.deepEqual(existsAndType(target_dir.path, "some_dir"), [true, false]);
    assert.deepEqual(existsAndType(target_dir.path, "some_dir/some_dir_2"), [
      true,
      false,
    ]);
    assert.deepEqual(existsAndType(target_dir.path, "some_dir_3"), [
      true,
      false,
    ]);
    assert.deepEqual(existsAndType(target_dir.path, "some_dir/__rest"), [
      false,
      null,
    ]);
    assert.deepEqual(existsAndType(target_dir.path, "__rest"), [false, null]);

    assert.equal(shapeInstRef.__dir instanceof Dir, true);
    assert.equal(shapeInstRef.some_file instanceof File, true);
    assert.equal(shapeInstRef.some_dir_3 instanceof Dir, true);
    assert.equal(shapeInstRef.some_dir.__dir instanceof Dir, true);
    assert.equal(shapeInstRef.some_dir.some_dir_2 instanceof Dir, true);
    assert.equal(shapeInstRef.some_dir.some_file_2 instanceof File, true);

    target_dir.delete();
    done();
  });

  it(".validate() empty folder", (done) => {
    const target_dir = Dir.tmpDir();
    assert.equal(shape.validate(target_dir.path).arr.length, 3);
    target_dir.delete();
    done();
  });

  it(".validate() correct folder", (done) => {
    const target_dir = Dir.tmpDir();
    shape.createShapeInst(target_dir.path);
    assert.equal(shape.validate(target_dir.path).arr.length, 0);
    target_dir.delete();
    done();
  });

  it(".validate() __rest", (done) => {
    const target_dir = Dir.tmpDir();
    shape.createShapeInst(target_dir.path);

    target_dir.createFile("rest100.txt");
    target_dir.createFile("foo12021bar.any");
    target_dir.getDir("some_dir").createFile("some_thing.txt");

    assert.equal(shape.validate(target_dir.path).arr.length, 0);
    target_dir.delete();
    done();
  });
});
