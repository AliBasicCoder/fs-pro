# fs-pro

a library to work with files as objects

see the full docs [here](https://fs-pro-docs.herokuapp.com/)

## installation

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
