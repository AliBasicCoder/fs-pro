import { statSync, Stats } from "fs";

export function stat(path: string) {
  try {
    return statSync(path);
  } catch (error) {
    return new Stats();
  }
}
