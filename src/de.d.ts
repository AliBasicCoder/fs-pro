declare module "del-symlinks" {
  type func = (arr: string[]) => Promise<void>;

  interface delSymlinks extends func {
    sync: (arr: string[]) => string[];
  }

  const f: delSymlinks;

  export default f;
}
