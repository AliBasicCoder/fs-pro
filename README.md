# fs-pro-light

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/10435d4146374b0c834b6b1afe60d0b3)](https://app.codacy.com/manual/AliBasicCoder/fs-pro?utm_source=github.com&utm_medium=referral&utm_content=AliBasicCoder/fs-pro&utm_campaign=Badge_Grade_Dashboard)
[![npm](https://img.shields.io/npm/v/fs-pro-light)](https://npmjs.com/package/fs-pro-light)

a library to work with files as objects

see the full docs [here](https://fs-pro-docs.herokuapp.com/)

## Features

- you don't to get the path of the file every single time you want to do something with it
- Strong typed and documented in the code
- provides a method to parse json files [.json\(\)](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#json)
- object will be automatically be stringified to json when you use the [write](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#write) method
- have a file structure system see [Model Class](https://fs-pro-docs.herokuapp.com/classes/_src_model_.model.html)
- will delete the whole dir when you use the [delete](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#delete) method
- provide advanced watching methods see [Dir.watch method](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#watch) and [File.watch method](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#watch)

## Api

- [File](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html)

  - [constructor](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#constructor)
  - [base](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#base)
  - [directory](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#directory)
  - [extension](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#extension)
  - [name](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#name)
  - [path](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#path)
  - [root](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#root)
  - [createdAt](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#createdAt)
  - [lastAccessed](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#lastAccessed)
  - [lastChanged](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#lastChanged)
  - [lastModified](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#lastModified)
  - [size](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#size)
  - [append](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#append)
  - [copyTo](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#copyTo)
  - [create](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#create)
  - [createReadStream](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#createReadStream)
  - [createWriteStream](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#createWriteStream)
  - [delete](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#delete)
  - [json](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#json)
  - [moveTo](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#moveTo)
  - [read](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#read)
  - [rename](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#rename)
  - [splitBy](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#splitBy)
  - [stats](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#stats)
  - [unwatch](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#unwatch)
  - [watch](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#watch)
  - [write](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#write)
  - [chmod](https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html#chmod)

- [Dir](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html)

  - [constructor](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#constructor)
  - [name](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#name)
  - [parentDirectory](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#parentDirectory)
  - [path](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#path)
  - [root](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#root)
  - [watcher](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#watcher)
  - [createdAt](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#createdAt)
  - [lastAccessed](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#lastAccessed)
  - [lastChanged](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#lastChanged)
  - [lastModified](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#lastModified)
  - [size](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#size)
  - [create](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#create)
  - [createDir](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#createDir)
  - [createFile](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#createFile)
  - [delete](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#delete)
  - [deleteMatchDir](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#deleteMatchDir)
  - [deleteMatchFile](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#deleteMatchFile)
  - [deleteMath](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#deleteMatch)
  - [read](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#read)
  - [rename](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#rename)
  - [stats](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#stats)
  - [unwatch](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#unwatch)
  - [watch](https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html#watch)

- [Model](https://fs-pro-docs.herokuapp.com/classes/_src_model_.model.html)
  - [constructor](https://fs-pro-docs.herokuapp.com/classes/_src_model_.model.html#constructor)
  - [data](https://fs-pro-docs.herokuapp.com/classes/_src_model_.model.html#data)
  - [createAt](https://fs-pro-docs.herokuapp.com/classes/_src_model_.model.html#createAt)
  - [structure](https://fs-pro-docs.herokuapp.com/classes/_src_model_.model.html#structure)
  - [Dir](https://fs-pro-docs.herokuapp.com/classes/_src_model_.model.html#Dir)
  - [File](https://fs-pro-docs.herokuapp.com/classes/_src_model_.model.html#File)

## Installation

via npm:

```
npm i fs-pro-light
```

via yarn:

```
yarn add fs-pro-light
```

## Usage

```js
import { File, Dir } from "fs-pro-light";

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
```

## Licence

copyright (c) AliBasicCoder 2020
