import { Dir } from "./dir.ts";
import { File } from "./file.ts";
import { Shape } from "./Shape.ts";
import type { Plugin } from "./types.ts";

const index = {
  File,
  Dir,
  Shape,
};

function getStaticMethods(cl: any) {
  return Object.getOwnPropertyNames(cl).slice(0, 2).slice(0, 1);
}

function getMethods(cl: any) {
  return Object.getOwnPropertyNames(cl.prototype).slice(1);
}

const native_methods = {
  File: {
    static: getStaticMethods(index.File),
    inst: getMethods(index.File),
  },
  Dir: {
    static: getStaticMethods(index.Dir),
    inst: getMethods(index.Dir),
  },
  Shape: {
    static: getStaticMethods(index.Shape),
    inst: getMethods(index.Shape),
  },
};

const track: {
  pluginName: string;
  methodName: string;
  className: string;
  isStatic: boolean;
}[] = [];

const addedPlugins: string[] = [];

function checkIfOverwrites(element: Plugin["plugin"][0], pluginName: string) {
  for (let i = 0; i < track.length; i++) {
    const { className, methodName, isStatic } = track[i];
    if (
      element.className === className &&
      element.methodName === methodName &&
      element.isStatic === isStatic
    )
      throw new Error(
        `Plugin ${pluginName} tries to overwrite ${className}.${methodName}() added by plugin: ${pluginName}`
      );
  }
  return -1;
}

/**
 * adds plugins to the core library
 * plugins is a way to add methods to the core class like File, Dir, etc...
 * @param pluginWrapper the plugin
 * @param allowPluginOverwrite if `true` will allow provided plugin to overwrite any method added by any plugin
 * @example ```js
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
 */
export function addPlugin(
  pluginWrapper: Plugin,
  allowPluginOverwrite: boolean = false
) {
  const { requires, plugin } = pluginWrapper;
  if (requires) {
    requires.forEach((rq) => addPlugin(rq));
  }
  // prevent addPlugin form loading a plugin twice
  if (addedPlugins.includes(pluginWrapper.name)) return;
  for (let i = 0; i < plugin.length; i++) {
    const element = plugin[i];
    if (element.isStatic) {
      if (native_methods[element.className].static.includes(element.methodName))
        throw new Error(
          `Plugin "${pluginWrapper.name}" tries to overwrite native methods`
        );
      if (!allowPluginOverwrite) checkIfOverwrites(element, pluginWrapper.name);
      // @ts-ignore
      index[element.className][element.methodName] = element.func;
    } else {
      if (native_methods[element.className].inst.includes(element.methodName))
        throw new Error(
          `Plugin "${pluginWrapper.name}" tries to overwrite native methods`
        );
      if (!allowPluginOverwrite) checkIfOverwrites(element, pluginWrapper.name);
      // @ts-ignore
      index[element.className].prototype[element.methodName] = element.func;
    }
    track.push({
      pluginName: pluginWrapper.name,
      className: element.className,
      methodName: element.methodName,
      isStatic: element.isStatic,
    });
  }
  addedPlugins.push(pluginWrapper.name);
}
