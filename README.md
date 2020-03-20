# fs-pro

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/10435d4146374b0c834b6b1afe60d0b3)](https://app.codacy.com/manual/AliBasicCoder/fs-pro?utm_source=github.com&utm_medium=referral&utm_content=AliBasicCoder/fs-pro&utm_campaign=Badge_Grade_Dashboard)

a library to work with files as objects

see the full docs [here](https://fs-pro-docs.herokuapp.com/)

## Usage

```js
import { File } from "fs-pro";

const file = new File("hello_world.txt");

file.write("hello").append("world");
// ...
```

## Licence

copyright (c) AliBasicCoder 2020
