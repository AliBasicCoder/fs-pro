import "../../dist/fs-pro.d";
import type {
  File as FileType,
  Dir as DirType,
  Shape as ShapeType,
  addPlugin as addPluginType,
  // @ts-ignore
} from "fs-pro";

const {
  File,
  Dir,
  Shape,
  addPlugin,
}: {
  File: typeof FileType;
  Dir: typeof DirType;
  Shape: typeof ShapeType;
  addPlugin: typeof addPluginType;
} = require("../../dist/fs-pro");

export {
  File,
  FileType,
  Dir,
  DirType,
  Shape,
  ShapeType,
  addPlugin,
  addPluginType,
};
