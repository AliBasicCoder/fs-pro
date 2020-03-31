import { File, Dir, Model, Structure } from "../src/index";
import { objAny, Plugin } from "../src/types";

function main(className: string, arg: objAny): Plugin["plugin"] {
  const obj = { ...arg };
  const plugin = [];
  const keys = Object.keys(obj);
  for (const key of keys) {
    if (typeof obj[key] === "function") {
      plugin.push({
        methodName: key,
        className,
        isStatic: false,
        func(...args: any[]) {
          return new Promise((res, rej) => {
            try {
              /* prettier-ignore */
              const newObj =
                className === "File" || className === "Dir"
                  ? {
                    path: this.path,
                    name: this.name,
                    base: this.base,
                    extension: this.extension,
                    directory: this.directory,
                    root: this.root
                  }
                  : {};
              /* prettier-ignore-end */
              res(obj[key].apply({ ...newObj, ...obj }, args));
            } catch (error) {
              rej(error);
            }
          });
        }
      });
    }
  }
  // @ts-ignore
  return plugin;
}

const asyncPlugin: Plugin = {
  name: "async",
  plugin: [
    ...main("File", File.prototype),
    ...main("Dir", Dir.prototype),
    ...main("Model", Model.prototype),
    ...main("Structure", Structure)
  ]
};

export default asyncPlugin;
