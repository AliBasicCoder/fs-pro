// @ts-ignore
import delSym from "del-symlinks";
import { unlinkSync } from "fs";

export function unlink(path: string) {
  try {
    unlinkSync(path);
  } catch (error) {
    delSym.sync([path]);
  }
}
