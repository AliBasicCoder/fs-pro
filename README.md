# fs-pro-light

a library to work with files as objects

see the full docs [here](https://fs-pro-docs.herokuapp.com/)

## Features

- you don't to get the path of the file every single time you want to do something with it
- Strong typed and documented in the code
- provides a method to parse json files [.json\(\)](https://fs-pro-docs.herokuapp.com/classes/_file_.file.html#json)
- object will be automatically be stringified to json when you use the [write](https://fs-pro-docs.herokuapp.com/classes/_file_.file.html#write) method
- have a file structure system see [Model Class](https://fs-pro-docs.herokuapp.com/classes/_model_.model.html)
- will delete the whole dir when you use the [delete](https://fs-pro-docs.herokuapp.com/classes/_dir_.dir.html#delete) method
- provide advanced watching methods see [Dir.watch method](https://fs-pro-docs.herokuapp.com/classes/_dir_.dir.html#watch) and [File.watch method](https://fs-pro-docs.herokuapp.com/classes/_file_.file.html#watch)

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
import { File, Dir } from "fs-pro";

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
