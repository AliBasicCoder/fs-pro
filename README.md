# fs-pro

![fs pro logo](https://github.com/AliBasicCoder/fs-pro/blob/master/fsProNewLogo.svg?raw=true)

[![nest badge](https://nest.land/badge-large.svg)](https://nest.land/package/fs-pro)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/10435d4146374b0c834b6b1afe60d0b3)](https://app.codacy.com/manual/AliBasicCoder/fs-pro?utm_source=github.com&utm_medium=referral&utm_content=AliBasicCoder/fs-pro&utm_campaign=Badge_Grade_Dashboard)
[![npm](https://img.shields.io/npm/v/fs-pro)](https://npmjs.com/package/fs-pro)
[![npm](https://img.shields.io/npm/dm/fs-pro)](https://npmjs.com/package/fs-pro)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/fs-pro)](https://npmjs.com/package/fs-pro)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/AliBasicCoder/fs-pro/Node.js%20CI)](https://github.com/AliBasicCoder/fs-pro/actions?query=workflow%3A%22Node.js+CI%22)

a library to work with files as objects

see the full docs [here](https://fs-pro-docs.herokuapp.com/)

## Features

- works on both node and deno
- you don't have to get the path of the file or directory every single time you want to do something with it
- Strong typed and documented in the code
- provides a method to parse json files [.json\(\)](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#json)
- object will be automatically be stringified to json when you use the [write](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#write) method
- have a file structure system see [Shape](https://fs-pro-docs.herokuapp.com/classes/_src_shape.shape.html)
- will delete the whole dir when you use the [delete](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#delete) method
- provide advanced watching methods see [Dir.watch method](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#watch) and [File.watch method](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#watch)
- you could add any method you like on any class you like via plugins see [how to create plugins](#creating%20plugins) and [addPlugin](https://fs-pro-docs.herokuapp.com/modules/_src_pluginadder_.html#addplugin)

## Installation

via npm:

```
npm i fs-pro
```

via yarn:

```
yarn add fs-pro
```

via deno.land

```
import * as fsPro from "http://deno.land/x/fs_pro@version/mod.ts";
```

via nest.land

```
import * as fsPro from "https://x.nest.land/fs-pro@version/mod.ts";
```

## Usage

```js
import { File, Dir, Shape } from "fs-pro";

// creating a file object
const file = new File(__dirname, "hello_world.txt");
// creating a directory object
const dir = new Dir(__dirname, "some_dir");

file
  // writing to the file
  .write("hello ");
  // append content to the file
  .append("world");

console.log(file.read().toString()) // => "hello world"
// and there's much more in the docs

dir
  // create the directory (in the actual hard disk aka file system)
  .create()
  // creating a directory in the directory
  .createDir("sub_dir");
  // creating a file in the directory (this create a file object)
  .createFile("text.txt")
// and there's much more in the docs

// the Shape class is a class that helps you manage your directory
// the Shape instance (or inst for short) is the Shape applied to a directory
// the Shape instance reference is a JS object the references the Shape instance
// the Shape constructor takes the Shape of your directory
// every key in the object passed in is an identifier for the file or dir
const shape = new Shape({
  // for adding files use Shape.File with the file name
  some_file: Shape.File("some_file.txt"),
  // for adding a directory of files use Shape.Dir with
  // the dir name and file name regex (a custom type of regex to test if the filename matches it)
  // see Shape.File doc for more information about filename regex
  some_dir: Shape.Dir("some_dir", Shape.File("test[0-9]{3}.txt|*.any")),
  // for adding a shaped folder use Shape.Dir with the directory name
  // and the shape of it
  some_shaped_dir: Shape.Dir("shaped_dir", {
    file_1: Shape.File("file_1.txt"),
    // ...
  }),
  // __rest tells Shape that any thing not mentioned
  // must follow the given shape
  __rest: Shape.File("*.txt"),
});

const shapeInstRef = shape.createShapeInst(target_dir);

shapeInstRef.some_file.write("hello world");

shapeInstRef.some_dir.createFile("test100.txt");

shapeInstRef.some_shaped_dir.file_1.write("hello world");

```

## Api

- [File](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html)

  - [path](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#path)
  - [name](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#name)
  - [base](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#base)
  - [extension](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#extension)
  - [directory](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#directory)
  - [root](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#root)
  - [write](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#write)
  - [read](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#read)
  - [append](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#append)
  - [overwrite](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#overwrite)
  - [getIndex](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#getindex)
  - [getIndexBetween](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#getindexbetween)
  - [splitBy](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#splitby)
  - [json](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#json)
  - [create](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#create)
  - [watch](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#watch)
  - [unwatch](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#unwatch)
  - [stat](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#stat)
  - [lstat](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#lstat)
  - [delete](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#delete)
  - [copyTo](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#copyto)
  - [moveTo](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#moveto)
  - [rename](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#rename)
  - [chmod](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#chmod)
  - [exits](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#exits)
  - [validate](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#validate)
  - [valid](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#valid)
  - [tmpFile](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#tmpfile)

- [Dir](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html)

  - [path](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#path)
  - [name](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#name)
  - [parentDirectory](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#parentdirectory)
  - [root](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#root)
  - [read](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#read)
  - [readResolve](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#readresolve)
  - [forEach](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#foreach)
  - [forEachFile](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#foreachfile)
  - [forEachDir](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#foreachdir)
  - [create](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#create)
  - [createFile](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#createfile)
  - [createDir](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#createdir)
  - [watch](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#watch)
  - [unwatch](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#unwatch)
  - [delete](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#delete)
  - [deleteMath](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#deletemath)
  - [deleteMatchFile](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#deletematchfile)
  - [deleteMatchDir](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#deletematchdir)
  - [stat](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#stat)
  - [lstat](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#lstat)
  - [rename](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#rename)
  - [exits](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#exits)
  - [getFile](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#getfile)
  - [getDir](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#getdir)
  - [copyTo](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#copyto)
  - [moveTo](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#moveto)
  - [tmpDir](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#tmpdir)

- [Shape](https://fs-pro-docs.herokuapp.com/classes/_src_shape_.shape.html)

  - [shapeObj](https://fs-pro-docs.herokuapp.com/classes/_src_shape_.shape.html#shapeobj)
  - [createShapeInst](https://fs-pro-docs.herokuapp.com/classes/_src_shape_.shape.html#createshapeinst)
  - [validate](https://fs-pro-docs.herokuapp.com/classes/_src_shape_.shape.html#validate)
  - [File](https://fs-pro-docs.herokuapp.com/classes/_src_shape_.shape.html#file)
  - [Dir](https://fs-pro-docs.herokuapp.com/classes/_src_shape_.shape.html#dir)

- [addPlugin](https://fs-pro-docs.herokuapp.com/modules/_src_pluginadder_.html#addplugin)
- [getPluginTrack](https://fs-pro-docs.herokuapp.com/modules/_src_pluginadder_.html#getplugintrack)
- [getPluginTrackFormatted](https://fs-pro-docs.herokuapp.com/modules/_src_pluginadder_.html#getplugintrackformatted)
- [setFs](https://fs-pro-docs.herokuapp.com/modules/_src_fs_.html#setfs)

## Creating plugins

```ts
import { Plugin } from "fs-pro/types";
import { addPlugin } from "fs-pro";

const myPlugin: Plugin = {
  name: "your-plugin-name",
  required: [anyRequiredPlugin] // optional
  plugin: [
    {
      methodName: "myMethod",
      className: "File", // could be the name of any class in the library (File or Dir or Shape)
      isStatic: false, // if true the method you add will be static
      func(...myArgs: any[]){
        // your code...
      }
    }
  ]
}

export default myPlugin
```

## Using Plugins

```ts
import { addPlugin } from "fs-pro";
import myPlugin from "./my-plugin";

addPlugin(myPlugin);
```

<!--
first you will need at a folder like this one

```
|
|__ index.ts (optional but recommend)
|__ index.d.ts
|__ package.json
```

in the index.ts

```ts
import { Plugin } from "fs-pro/types";

const myPlugin: Plugin = {
  name: "your-plugin-name",
  required: [anyRequiredPlugin] // optional
  plugin: [
    {
      methodName: "myMethod",
      className: "File", // could be the name of any class in the library (File or Dir or Shape)
      isStatic: false, // if true the method you add will be static
      func(...myArgs: any[]){
        // your code...
      }
    }
  ]
}

export default myPlugin

```

in index.d.ts

```ts
import * as fsPro from "fs-pro";

declare global {
  namespace fsPro {
    interface File /* or any class you to add methods to */ {
      myMethod(...myArgs: any[]): any;
    }
  }
}

declare module "my-plugin" {
  import { Plugin } from "fs-pro/types";

  const xmlPlugin: Plugin;

  export default xmlPlugin;
}
```

## Using Plugins

```ts
import { addPlugin } from "fs-pro";
import myPlugin from "my-plugin";

addPlugin(myPlugin);
``` -->

## Licence

copyright (c) AliBasicCoder 2020
