import { pathObjType } from "./types";

let path: pathObjType;

/**
 * this function allows you to override the path module
 * that path-pro uses
 * @param newPath the new path
 */
export function setPath(newPath: pathObjType) {
  path = newPath;
}

export function join(...args: Parameters<pathObjType["join"]>) {
  return path.join(...args);
}

export function parse(...args: Parameters<pathObjType["parse"]>) {
  return path.parse(...args);
}
