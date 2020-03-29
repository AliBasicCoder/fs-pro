// import { File } from "./file";
// import { Dir } from "./dir";
// import { Model } from "./model";
// import { Structure } from "./structure";
import * as index from "./index";
import { Plugin } from "./types";

export function addPlugin(pluginWrapper: Plugin) {
  const { requires, plugin } = pluginWrapper;
  if (requires) {
    requires.forEach(addPlugin);
  }
  for (let i = 0; i < plugin.length; i++) {
    const element = plugin[i];
    if (element.isStatic) {
      // @ts-ignore
      index[element.className][element.methodName] = element.func;
    } else {
      // @ts-ignore
      index[element.className].prototype[element.methodName] = element.func;
    }
  }
}
