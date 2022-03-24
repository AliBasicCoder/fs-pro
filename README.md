# fs pro

<!-- ![fs pro logo](https://github.com/AliBasicCoder/fs-pro/blob/master/fsProNewLogo.svg?raw=true) -->

> A small package to manage your files and folders easily

[![nest badge](https://nest.land/badge-large.svg)](https://nest.land/package/fs-pro)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/10435d4146374b0c834b6b1afe60d0b3)](https://app.codacy.com/manual/AliBasicCoder/fs-pro?utm_source=github.com&utm_medium=referral&utm_content=AliBasicCoder/fs-pro&utm_campaign=Badge_Grade_Dashboard)
[![npm](https://img.shields.io/npm/v/fs-pro)](https://npmjs.com/package/fs-pro)
[![npm](https://img.shields.io/npm/dm/fs-pro)](https://npmjs.com/package/fs-pro)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/fs-pro)](https://npmjs.com/package/fs-pro)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/AliBasicCoder/fs-pro/Node.js%20CI)](https://github.com/AliBasicCoder/fs-pro/actions?query=workflow%3A%22Node.js+CI%22)

see the API documentation [here](https://alibasiccoder.github.io/fs-pro/)

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Api links](#api)
- [Creating plugins](#creating-plugins)
- [Using Plugins](#using-plugins)

## Features

- works on both node and deno
- you don't have to get the path of the file or directory every single time you want to do something with it
- Strong typed and documented in the code
- provides a method to parse json files [.json\(\)](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#json)
- object will be automatically be stringified to json when you use the [write](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#write) method
- have a file structure system see [Shape](https://alibasiccoder.github.io/fs-pro/classes/_src_shape.shape.html)
- will delete the whole dir when you use the [delete](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#delete) method
- provide advanced watching methods see [Dir.watch method](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#watch) and [File.watch method](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#watch)
- you could add any method you like on any class you like via plugins see [how to create plugins](#creating%20plugins) and [addPlugin](https://alibasiccoder.github.io/fs-pro/modules/_src_pluginadder_.html#addplugin)

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

// imagine that you want to check if a folder
// 1. has an folder named "something"
// 2. has an folder named "js_ts_files" that only contains js and ts files
// 3. any thing else in this folder must be a txt file
// you can do that easily with Shape

// (1) Create the Shape
const shape = new Shape({
  // Shape.Dir means that "something" is a folder
  // Shape.File tells the type of files that can be in the folder
  // (like, .txt, .js, ...etc) here *.* means any thing
  something: Shape.Dir("something", Shape.File("*.*")),
  // Notice js_ts_files is the name that you can reference in your code
  // but "js_ts_files" passed in Shape.Dir in the actual name in the files system 
  js_ts_files: Shape.Dir("js_ts_files", Shape.File("*.js|*.ts")),
  // __rest means any thing else in the folder
  __rest: Shape.File("*.txt")
});

// (2) Check the folder
// returns an array of errors
const errs = shape.validate(folder_path);

if (errs.length === 0) console.log("no errors");

// or..
// when you pass true shape.validate will throw an error
// if the folder doesn't match the shape
shape.validate(folder_path, true);
```

## Api

- [File](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html)

  - [path](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#path)
  - [name](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#name)
  - [base](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#base)
  - [extension](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#extension)
  - [directory](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#directory)
  - [root](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#root)
  - [write](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#write)
  - [read](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#read)
  - [append](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#append)
  - [overwrite](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#overwrite)
  - [getIndex](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#getindex)
  - [getIndexBetween](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#getindexbetween)
  - [splitBy](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#splitby)
  - [json](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#json)
  - [create](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#create)
  - [watch](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#watch)
  - [unwatch](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#unwatch)
  - [stat](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#stat)
  - [lstat](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#lstat)
  - [delete](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#delete)
  - [copyTo](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#copyto)
  - [moveTo](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#moveto)
  - [rename](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#rename)
  - [chmod](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#chmod)
  - [exits](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#exits)
  - [validate](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#validate)
  - [valid](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#valid)
  - [open](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#open)
  - [close](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#close)
  - [tmpFile](https://alibasiccoder.github.io/fs-pro/classes/_src_file_.file.html#tmpfile)

- [Dir](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html)

  - [path](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#path)
  - [name](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#name)
  - [parentDirectory](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#parentdirectory)
  - [root](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#root)
  - [read](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#read)
  - [readResolve](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#readresolve)
  - [forEach](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#foreach)
  - [forEachFile](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#foreachfile)
  - [forEachDir](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#foreachdir)
  - [create](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#create)
  - [createFile](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#createfile)
  - [createDir](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#createdir)
  - [watch](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#watch)
  - [unwatch](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#unwatch)
  - [delete](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#delete)
  - [deleteMath](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#deletemath)
  - [deleteMatchFile](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#deletematchfile)
  - [deleteMatchDir](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#deletematchdir)
  - [stat](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#stat)
  - [lstat](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#lstat)
  - [rename](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#rename)
  - [exits](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#exits)
  - [getFile](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#getfile)
  - [getDir](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#getdir)
  - [copyTo](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#copyto)
  - [moveTo](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#moveto)
  - [tmpDir](https://alibasiccoder.github.io/fs-pro/classes/_src_dir_.dir.html#tmpdir)

- [Shape](https://alibasiccoder.github.io/fs-pro/classes/_src_shape_.shape.html)

  - [shapeObj](https://alibasiccoder.github.io/fs-pro/classes/_src_shape_.shape.html#shapeobj)
  - [createShapeInst](https://alibasiccoder.github.io/fs-pro/classes/_src_shape_.shape.html#createshapeinst)
  - [validate](https://alibasiccoder.github.io/fs-pro/classes/_src_shape_.shape.html#validate)
  - [File](https://alibasiccoder.github.io/fs-pro/classes/_src_shape_.shape.html#file)
  - [Dir](https://alibasiccoder.github.io/fs-pro/classes/_src_shape_.shape.html#dir)

- [addPlugin](https://alibasiccoder.github.io/fs-pro/modules/_src_pluginadder_.html#addplugin)
- [getPluginTrack](https://alibasiccoder.github.io/fs-pro/modules/_src_pluginadder_.html#getplugintrack)
- [getPluginTrackFormatted](https://alibasiccoder.github.io/fs-pro/modules/_src_pluginadder_.html#getplugintrackformatted)
- [setFs](https://alibasiccoder.github.io/fs-pro/modules/_src_fs_.html#setfs)

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
