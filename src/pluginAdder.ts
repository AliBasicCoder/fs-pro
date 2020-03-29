import * as index from "./index";
import { Plugin } from "./types";

/**
 * adds plugins to the core library
 * plugins is a way to add methods to the core class like File, Dir, etc...
 * ```js
 * addPlugin({
 *   name: "xml",
 *   plugin: [
 *     {
 *       methodName: "xml",
 *       func: function(compact: boolean = true, spaces: number = 2) {
 *         return xmlJs.xml2json(this.read(), { compact, spaces });
 *       },
 *       className: "File",
 *       isStatic: false
 *     }]
 *  });
 * ```
 * @param pluginWrapper the plugin
 */
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
