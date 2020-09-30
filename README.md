# fs-pro

![fs pro logo](https://github.com/AliBasicCoder/fs-pro/blob/master/fsProNewLogo.svg?raw=true)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/10435d4146374b0c834b6b1afe60d0b3)](https://app.codacy.com/manual/AliBasicCoder/fs-pro?utm_source=github.com&utm_medium=referral&utm_content=AliBasicCoder/fs-pro&utm_campaign=Badge_Grade_Dashboard)
[![npm](https://img.shields.io/npm/v/fs-pro)](https://npmjs.com/package/fs-pro)
[![npm](https://img.shields.io/npm/dm/fs-pro)](https://npmjs.com/package/fs-pro)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/fs-pro)](https://npmjs.com/package/fs-pro)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/AliBasicCoder/fs-pro/Node.js%20CI)](https://github.com/AliBasicCoder/fs-pro/actions?query=workflow%3A%22Node.js+CI%22)

a library to work with files as objects

see the full docs [here](https://fs-pro-docs.herokuapp.com/)

## Features

- you don't have to get the path of the file or directory every single time you want to do something with it
- Strong typed and documented in the code
- provides a method to parse json files [.json\(\)](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#json)
- object will be automatically be stringified to json when you use the [write](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#write) method
- have a file structure system see [Model Class](https://fs-pro-docs.herokuapp.com/classes/_src_model_.model.html)
- will delete the whole dir when you use the [delete](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#delete) method
- provide advanced watching methods see [Dir.watch method](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#watch) and [File.watch method](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#watch)
- you could add or overwrite any method you like on any class you like via plugins see [how to create plugins](#Creating%20plugins) and [addPlugin](https://fs-pro-docs.herokuapp.com/modules/_src_pluginadder_.html#addplugin)

## Api

- [File](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html)

  - [constructor](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#constructor)
  - [base](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#base)
  - [directory](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#directory)
  - [extension](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#extension)
  - [name](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#name)
  - [path](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#path)
  - [root](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#root)
  - [createdAt](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#createdat)
  - [lastAccessed](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#lastaccessed)
  - [lastChanged](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#lastchanged)
  - [lastModified](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#lastmodified)
  - [size](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#size)
  - [append](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#append)
  - [copyTo](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#copyTo)
  - [create](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#create)
  - [createReadStream](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#createreadstream)
  - [createWriteStream](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#createwritestream)
  - [delete](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#delete)
  - [json](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#json)
  - [moveTo](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#moveto)
  - [read](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#read)
  - [rename](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#rename)
  - [splitBy](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#splitby)
  - [stats](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#stats)
  - [unwatch](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#unwatch)
  - [watch](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#watch)
  - [write](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#write)
  - [chmod](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#chmod)
  - [exits](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#exits)
  - [getIndex](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#getindex)
  - [getIndexBetween](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#getindexbetween)

- [Dir](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html)

  - [constructor](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#constructor)
  - [name](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#name)
  - [parentDirectory](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#parentDirectory)
  - [path](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#path)
  - [root](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#root)
  - [watcher](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#watcher)
  - [createdAt](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#createdat)
  - [lastAccessed](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#lastaccessed)
  - [lastChanged](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#lastchanged)
  - [lastModified](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#lastmodified)
  - [size](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#size)
  - [create](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#create)
  - [createDir](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#createdir)
  - [createFile](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#createfile)
  - [getDir](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#getdir)
  - [getFile](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#getfile)
  - [delete](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#delete)
  - [deleteMatchDir](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#deletematchdir)
  - [deleteMatchFile](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#deletematchfile)
  - [deleteMath](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#deletematch)
  - [read](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#read)
  - [rename](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#rename)
  - [stats](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#stats)
  - [unwatch](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#unwatch)
  - [watch](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#watch)

- [addPlugin](https://fs-pro-docs.herokuapp.com/modules/_src_pluginadder_.html#addplugin)

## Installation

via npm:

```
npm i fs-pro
```

via yarn:

```
yarn add fs-pro
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
  // the dir name and file name regex
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

## Creating plugins

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
```

## Licence

copyright (c) AliBasicCoder 2020
