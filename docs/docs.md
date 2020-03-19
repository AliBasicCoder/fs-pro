- [fs-pro](#fs-pro)
  - [Index](#index)
    - [Modules](#modules)
- [Class: Dir](#class-dir)
  - [Hierarchy](#hierarchy)
  - [Index](#index-1)
    - [Constructors](#constructors)
    - [Properties](#properties)
    - [Accessors](#accessors)
    - [Methods](#methods)
  - [Constructors](#constructors-1)
    - [constructor](#constructor)
  - [Properties](#properties-1)
    - [name](#name)
    - [parentDirectory](#parentdirectory)
    - [path](#path)
    - [root](#root)
    - [`Private` `Optional` watcher](#private-optional-watcher)
  - [Accessors](#accessors-1)
    - [createdAt](#createdat)
    - [lastAccessed](#lastaccessed)
    - [lastChanged](#lastchanged)
    - [lastModified](#lastmodified)
    - [size](#size)
  - [Methods](#methods-1)
    - [create](#create)
    - [createDir](#createdir)
    - [createFile](#createfile)
    - [delete](#delete)
    - [read](#read)
    - [stats](#stats)
    - [unwatch](#unwatch)
    - [watch](#watch)
- [Class: File](#class-file)
  - [Hierarchy](#hierarchy-1)
  - [Index](#index-2)
    - [Constructors](#constructors-2)
    - [Properties](#properties-2)
    - [Accessors](#accessors-2)
    - [Methods](#methods-2)
  - [Constructors](#constructors-3)
    - [constructor](#constructor-1)
  - [Properties](#properties-3)
    - [base](#base)
    - [directory](#directory)
    - [extension](#extension)
    - [name](#name-1)
    - [path](#path-1)
    - [root](#root-1)
  - [Accessors](#accessors-3)
    - [createdAt](#createdat-1)
    - [lastAccessed](#lastaccessed-1)
    - [lastChanged](#lastchanged-1)
    - [lastModified](#lastmodified-1)
    - [size](#size-1)
  - [Methods](#methods-3)
    - [append](#append)
    - [copyTo](#copyto)
    - [create](#create-1)
    - [createReadStream](#createreadstream)
    - [createWriteStream](#createwritestream)
    - [delete](#delete-1)
    - [json](#json)
    - [moveTo](#moveto)
    - [read](#read-1)
    - [stats](#stats-1)
    - [unwatch](#unwatch-1)
    - [watch](#watch-1)
    - [write](#write)
- [Interface: ImprovedFSWatcher](#interface-improvedfswatcher)
  - [Hierarchy](#hierarchy-2)
  - [Index](#index-3)
    - [Methods](#methods-4)
  - [Methods](#methods-5)
    - [addListener](#addlistener)
    - [close](#close)
    - [emit](#emit)
    - [eventNames](#eventnames)
    - [getMaxListeners](#getmaxlisteners)
    - [isClosed](#isclosed)
    - [listenerCount](#listenercount)
    - [listeners](#listeners)
    - [off](#off)
    - [on](#on)
    - [once](#once)
    - [prependListener](#prependlistener)
    - [prependOnceListener](#prependoncelistener)
    - [rawListeners](#rawlisteners)
    - [removeAllListeners](#removealllisteners)
    - [removeListener](#removelistener)
    - [setMaxListeners](#setmaxlisteners)
- [Module: "dir"](#module-dir)
  - [Index](#index-4)
    - [Classes](#classes)
- [Module: "file"](#module-file)
  - [Index](#index-5)
    - [Classes](#classes-1)
- [Module: "index"](#module-index)
- [Module: "types"](#module-types)
  - [Index](#index-6)
    - [Interfaces](#interfaces)
    - [Type aliases](#type-aliases)
  - [Type aliases](#type-aliases-1)
    - [WatchOptions](#watchoptions)
    - [obj](#obj)

# fs-pro

## Index

### Modules

- ["dir"](#modules_dir_md)
- ["file"](#modules_file_md)
- ["index"](#modules_index_md)
- ["types"](#modules_types_md)

[fs-pro](#readmemd) › [Globals](#globalsmd) › ["dir"](#modules_dir_md) › [Dir](#classes_dir_dirmd)

# Class: Dir

## Hierarchy

- **Dir**

## Index

### Constructors

- [constructor](#constructor)

### Properties

- [name](#name)
- [parentDirectory](#parentdirectory)
- [path](#path)
- [root](#root)
- [watcher](#private-optional-watcher)

### Accessors

- [createdAt](#createdat)
- [lastAccessed](#lastaccessed)
- [lastChanged](#lastchanged)
- [lastModified](#lastmodified)
- [size](#size)

### Methods

- [create](#create)
- [createDir](#createdir)
- [createFile](#createfile)
- [delete](#delete)
- [read](#read)
- [stats](#stats)
- [unwatch](#unwatch)
- [watch](#watch)

## Constructors

### constructor

\+ **new Dir**(...`args`: string[]): _[Dir](#classes_dir_dirmd)_

_Defined in [src/dir.ts:45](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L45)_

the Dir constructor
NOTE: the path you pass will passed to path.join

**Parameters:**

| Name      | Type     | Description |
| --------- | -------- | ----------- |
| `...args` | string[] | the path    |

**Returns:** _[Dir](#classes_dir_dirmd)_

## Properties

### name

• **name**: _string_

_Defined in [src/dir.ts:17](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L17)_

the name of the directory

---

### parentDirectory

• **parentDirectory**: _string_

_Defined in [src/dir.ts:23](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L23)_

the directory of the file

---

### path

• **path**: _string_

_Defined in [src/dir.ts:21](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L21)_

the path of the file

---

### root

• **root**: _string_

_Defined in [src/dir.ts:19](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L19)_

the root of the file

---

### `Private` `Optional` watcher

• **watcher**? : _[ImprovedFSWatcher](#interfaces_types_improvedfswatchermd)_

_Defined in [src/dir.ts:25](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L25)_

## Accessors

### createdAt

• **get createdAt**(): _Date_

_Defined in [src/dir.ts:43](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L43)_

The timestamp indicating when the file have been created

**Returns:** _Date_

---

### lastAccessed

• **get lastAccessed**(): _Date_

_Defined in [src/dir.ts:31](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L31)_

The timestamp indicating the last time this file was accessed.

**Returns:** _Date_

---

### lastChanged

• **get lastChanged**(): _Date_

_Defined in [src/dir.ts:39](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L39)_

The timestamp indicating the last time this file status was changed.

**Returns:** _Date_

---

### lastModified

• **get lastModified**(): _Date_

_Defined in [src/dir.ts:35](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L35)_

The timestamp indicating the last time this file was modified.

**Returns:** _Date_

---

### size

• **get size**(): _number_

_Defined in [src/dir.ts:27](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L27)_

the size of the file

**Returns:** _number_

## Methods

### create

▸ **create**(): _this_

_Defined in [src/dir.ts:77](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L77)_

creates the directory
example:

```js
dir.create();
```

**Returns:** _this_

---

### createDir

▸ **createDir**(`dirname`: string): _[Dir](#classes_dir_dirmd)‹›_

_Defined in [src/dir.ts:104](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L104)_

create a directory inside the directory
example:

```js
const subDir = dir.createDir("hello");
subDir.createFile("hello_world.txt");
// ...
```

**Parameters:**

| Name      | Type   | Description               |
| --------- | ------ | ------------------------- |
| `dirname` | string | the name of the directory |

**Returns:** _[Dir](#classes_dir_dirmd)‹›_

---

### createFile

▸ **createFile**(`filename`: string): _[File](#classes_file_filemd)‹›_

_Defined in [src/dir.ts:91](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L91)_

create a file inside the directory
example:

```js
const file = dir.createFile("hello_world.txt");
file.write("hello world");
//...
```

**Parameters:**

| Name       | Type   | Description                 |
| ---------- | ------ | --------------------------- |
| `filename` | string | the file you want to create |

**Returns:** _[File](#classes_file_filemd)‹›_

---

### delete

▸ **delete**(): _void_

_Defined in [src/dir.ts:138](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L138)_

deletes the directory even if it's not empty

**Returns:** _void_

---

### read

▸ **read**(): _string[]_

_Defined in [src/dir.ts:67](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L67)_

reads the directory
example:

```js
console.log(dir.read()); // => ["hello_world.txt", "file2.txt"]
```

**Returns:** _string[]_

---

### stats

▸ **stats**(): _Stats‹›_

_Defined in [src/dir.ts:147](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L147)_

get the stats of the directory @see https://nodejs.org/api/fs.html#fs_class_fs_stats

**Returns:** _Stats‹›_

---

### unwatch

▸ **unwatch**(): _this_

_Defined in [src/dir.ts:133](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L133)_

stops watching the directory

**Returns:** _this_

---

### watch

▸ **watch**(`listener`: function, `options?`: [WatchOptions](#watchoptions)): _[ImprovedFSWatcher](#interfaces_types_improvedfswatchermd)‹›_

_Defined in [src/dir.ts:123](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L123)_

watches the directory
example:

```js
dir.watch((e, file) => {
  if (e === "update") console.log(`file ${file.base} have been updated`);
  else console.log(`file ${file.base} have been removed`);
});
```

**Parameters:**

▪ **listener**: _function_

the function will be called when a file changes

▸ (`e`: "update" | "remove", `file`: [File](#classes_file_filemd)): _any_

**Parameters:**

| Name   | Type                         |
| ------ | ---------------------------- |
| `e`    | "update" &#124; "remove"     |
| `file` | [File](#classes_file_filemd) |

▪`Optional` **options**: _[WatchOptions](#watchoptions)_

options

**Returns:** _[ImprovedFSWatcher](#interfaces_types_improvedfswatchermd)‹›_

<a name="classes_file_filemd"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd) › ["file"](#modules_file_md) › [File](#classes_file_filemd)

# Class: File

## Hierarchy

- **File**

## Index

### Constructors

- [constructor](#constructor)

### Properties

- [base](#base)
- [directory](#directory)
- [extension](#extension)
- [name](#name)
- [path](#path)
- [root](#root)

### Accessors

- [createdAt](#createdat)
- [lastAccessed](#lastaccessed)
- [lastChanged](#lastchanged)
- [lastModified](#lastmodified)
- [size](#size)

### Methods

- [append](#append)
- [copyTo](#copyto)
- [create](#create)
- [createReadStream](#createreadstream)
- [createWriteStream](#createwritestream)
- [delete](#delete)
- [json](#json)
- [moveTo](#moveto)
- [read](#read)
- [stats](#stats)
- [unwatch](#unwatch)
- [watch](#watch)
- [write](#write)

## Constructors

### constructor

\+ **new File**(...`args`: string[]): _[File](#classes_file_filemd)_

_Defined in [src/file.ts:50](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L50)_

the File constructor
NOTE: the path you pass will passed to path.join

**Parameters:**

| Name      | Type     | Description |
| --------- | -------- | ----------- |
| `...args` | string[] | the path    |

**Returns:** _[File](#classes_file_filemd)_

## Properties

### base

• **base**: _string_

_Defined in [src/file.ts:24](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L24)_

the name with the extension

---

### directory

• **directory**: _string_

_Defined in [src/file.ts:30](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L30)_

the directory of the file

---

### extension

• **extension**: _string_

_Defined in [src/file.ts:22](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L22)_

the extension of the file

---

### name

• **name**: _string_

_Defined in [src/file.ts:20](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L20)_

the name of the file without the extension

---

### path

• **path**: _string_

_Defined in [src/file.ts:28](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L28)_

the path of the file

---

### root

• **root**: _string_

_Defined in [src/file.ts:26](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L26)_

the root of the file

## Accessors

### createdAt

• **get createdAt**(): _Date_

_Defined in [src/file.ts:48](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L48)_

The timestamp indicating when the file have been created

**Returns:** _Date_

---

### lastAccessed

• **get lastAccessed**(): _Date_

_Defined in [src/file.ts:36](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L36)_

The timestamp indicating the last time this file was accessed.

**Returns:** _Date_

---

### lastChanged

• **get lastChanged**(): _Date_

_Defined in [src/file.ts:44](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L44)_

The timestamp indicating the last time this file status was changed.

**Returns:** _Date_

---

### lastModified

• **get lastModified**(): _Date_

_Defined in [src/file.ts:40](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L40)_

The timestamp indicating the last time this file was modified.

**Returns:** _Date_

---

### size

• **get size**(): _number_

_Defined in [src/file.ts:32](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L32)_

the size of the file

**Returns:** _number_

## Methods

### append

▸ **append**(`data`: string | Buffer): _this_

_Defined in [src/file.ts:102](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L102)_

append some data to the file
example:

```js
file
  .append("hello")
  .append("world")
  .read(); // => hello world
```

**Parameters:**

| Name   | Type                 | Description    |
| ------ | -------------------- | -------------- |
| `data` | string &#124; Buffer | data to append |

**Returns:** _this_

---

### copyTo

▸ **copyTo**(`destination`: string, `isRelative`: boolean): _[File](#classes_file_filemd)‹›_

_Defined in [src/file.ts:183](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L183)_

copy the file to the destination
example:

```js
const newFile = file.copyTo("./some_dir");
newFile.write("hello world");
// ...
```

**Parameters:**

| Name          | Type    | Default | Description                                       |
| ------------- | ------- | ------- | ------------------------------------------------- |
| `destination` | string  | -       | the destination to copy the file to               |
| `isRelative`  | boolean | true    | tells the function if the path is relative or not |

**Returns:** _[File](#classes_file_filemd)‹›_

---

### create

▸ **create**(): _this_

_Defined in [src/file.ts:137](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L137)_

creates the file

**Returns:** _this_

---

### createReadStream

▸ **createReadStream**(): _ReadStream‹›_

_Defined in [src/file.ts:113](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L113)_

creates a read stream for the file
example of copying file content via streams:

```js
fileX.createReadStream().pipe(fileY.createWriteStream());
```

**Returns:** _ReadStream‹›_

---

### createWriteStream

▸ **createWriteStream**(): _WriteStream‹›_

_Defined in [src/file.ts:123](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L123)_

creates a write stream for the file
example of copying file content via streams:

```js
fileX.createReadStream().pipe(fileY.createWriteStream());
```

**Returns:** _WriteStream‹›_

---

### delete

▸ **delete**(): _void_

_Defined in [src/file.ts:169](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L169)_

delete the file

```js
file.delete();
fs.existsSync(file.path); // => false
```

**Returns:** _void_

---

### json

▸ **json**(): _any_

_Defined in [src/file.ts:133](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L133)_

reads the file as json
example:

```js
JsonFile.json(); // => { hello: "world" }
```

**Returns:** _any_

---

### moveTo

▸ **moveTo**(`destination`: string, `isRelative`: boolean): _this_

_Defined in [src/file.ts:199](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L199)_

moves the file to destination
example:

```js
file.moveTo("./newFile.txt");
file.write("hello world");
// ...
```

**Parameters:**

| Name          | Type    | Default | Description                                       |
| ------------- | ------- | ------- | ------------------------------------------------- |
| `destination` | string  | -       | the destination to copy the file to               |
| `isRelative`  | boolean | true    | tells the function if the path is relative or not |

**Returns:** _this_

---

### read

▸ **read**(): _Buffer‹›_

_Defined in [src/file.ts:91](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L91)_

reads the file
example:

```js
file.read().toString(); // => "hello world"
```

**Returns:** _Buffer‹›_

---

### stats

▸ **stats**(): _Stats‹›_

_Defined in [src/file.ts:159](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L159)_

gets the stats of the file @see https://nodejs.org/api/fs.html#fs_class_fs_stats

**Returns:** _Stats‹›_

---

### unwatch

▸ **unwatch**(): _this_

_Defined in [src/file.ts:154](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L154)_

stops watching the file

**Returns:** _this_

---

### watch

▸ **watch**(`listener`: function): _this_

_Defined in [src/file.ts:149](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L149)_

watches the file

```js
file.watch(function(e, filename) {
  console.log(`the file size is: ${this.size}`);
});
```

**Parameters:**

▪ **listener**: _function_

the function the will be called when the file changes

▸ (`this`: [File](#classes_file_filemd), `curr`: Stats, `prev`: Stats): _any_

**Parameters:**

| Name   | Type                         |
| ------ | ---------------------------- |
| `this` | [File](#classes_file_filemd) |
| `curr` | Stats                        |
| `prev` | Stats                        |

**Returns:** _this_

---

### write

▸ **write**(`data`: Buffer | string | [obj](#obj)‹any›): _this_

_Defined in [src/file.ts:78](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L78)_

write some data into the file
NOTE: if you pass an object it will be automatically
convert to json

```js
file.write("hello world");
file.write(Buffer.from("hello world"));
file.write({ hello: "world" });
```

**Parameters:**

| Name   | Type                                         | Description       |
| ------ | -------------------------------------------- | ----------------- |
| `data` | Buffer &#124; string &#124; [obj](#obj)‹any› | the data to write |

**Returns:** _this_

<a name="interfaces_types_improvedfswatchermd"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd) › ["types"](#modules_types_md) › [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd)

# Interface: ImprovedFSWatcher

## Hierarchy

- FSWatcher

  ↳ **ImprovedFSWatcher**

## Index

### Methods

- [addListener](#addlistener)
- [close](#close)
- [emit](#emit)
- [eventNames](#eventnames)
- [getMaxListeners](#getmaxlisteners)
- [isClosed](#isclosed)
- [listenerCount](#listenercount)
- [listeners](#listeners)
- [off](#off)
- [on](#on)
- [once](#once)
- [prependListener](#prependlistener)
- [prependOnceListener](#prependoncelistener)
- [rawListeners](#rawlisteners)
- [removeAllListeners](#removealllisteners)
- [removeListener](#removelistener)
- [setMaxListeners](#setmaxlisteners)

## Methods

### addListener

▸ **addListener**(`event`: string, `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[addListener](#addlistener)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:107

events.EventEmitter

1. change
2. error

**Parameters:**

▪ **event**: _string_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

▸ **addListener**(`event`: "change", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[addListener](#addlistener)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:108

**Parameters:**

▪ **event**: _"change"_

▪ **listener**: _function_

▸ (`eventType`: string, `filename`: string | Buffer): _void_

**Parameters:**

| Name        | Type                 |
| ----------- | -------------------- |
| `eventType` | string               |
| `filename`  | string &#124; Buffer |

**Returns:** _this_

▸ **addListener**(`event`: "error", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[addListener](#addlistener)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:109

**Parameters:**

▪ **event**: _"error"_

▪ **listener**: _function_

▸ (`error`: Error): _void_

**Parameters:**

| Name    | Type  |
| ------- | ----- |
| `error` | Error |

**Returns:** _this_

▸ **addListener**(`event`: "close", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[addListener](#addlistener)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:110

**Parameters:**

▪ **event**: _"close"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

---

### close

▸ **close**(): _void_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[close](#close)_

Defined in node_modules/@types/node/fs.d.ts:100

**Returns:** _void_

---

### emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): _boolean_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[emit](#emit)_

Defined in node_modules/@types/node/globals.d.ts:557

**Parameters:**

| Name      | Type                 |
| --------- | -------------------- |
| `event`   | string &#124; symbol |
| `...args` | any[]                |

**Returns:** _boolean_

---

### eventNames

▸ **eventNames**(): _Array‹string | symbol›_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[eventNames](#eventnames)_

Defined in node_modules/@types/node/globals.d.ts:562

**Returns:** _Array‹string | symbol›_

---

### getMaxListeners

▸ **getMaxListeners**(): _number_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[getMaxListeners](#getmaxlisteners)_

Defined in node_modules/@types/node/globals.d.ts:554

**Returns:** _number_

---

### isClosed

▸ **isClosed**(): _boolean_

_Defined in [src/types.ts:46](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/types.ts#L46)_

Returns `true` if the watcher has been closed.

**Returns:** _boolean_

---

### listenerCount

▸ **listenerCount**(`type`: string | symbol): _number_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[listenerCount](#listenercount)_

Defined in node_modules/@types/node/globals.d.ts:558

**Parameters:**

| Name   | Type                 |
| ------ | -------------------- |
| `type` | string &#124; symbol |

**Returns:** _number_

---

### listeners

▸ **listeners**(`event`: string | symbol): _Function[]_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[listeners](#listeners)_

Defined in node_modules/@types/node/globals.d.ts:555

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _Function[]_

---

### off

▸ **off**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[off](#off)_

Defined in node_modules/@types/node/globals.d.ts:551

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### on

▸ **on**(`event`: string, `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[on](#on)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:112

**Parameters:**

▪ **event**: _string_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

▸ **on**(`event`: "change", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[on](#on)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:113

**Parameters:**

▪ **event**: _"change"_

▪ **listener**: _function_

▸ (`eventType`: string, `filename`: string | Buffer): _void_

**Parameters:**

| Name        | Type                 |
| ----------- | -------------------- |
| `eventType` | string               |
| `filename`  | string &#124; Buffer |

**Returns:** _this_

▸ **on**(`event`: "error", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[on](#on)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:114

**Parameters:**

▪ **event**: _"error"_

▪ **listener**: _function_

▸ (`error`: Error): _void_

**Parameters:**

| Name    | Type  |
| ------- | ----- |
| `error` | Error |

**Returns:** _this_

▸ **on**(`event`: "close", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[on](#on)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:115

**Parameters:**

▪ **event**: _"close"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

---

### once

▸ **once**(`event`: string, `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[once](#once)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:117

**Parameters:**

▪ **event**: _string_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

▸ **once**(`event`: "change", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[once](#once)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:118

**Parameters:**

▪ **event**: _"change"_

▪ **listener**: _function_

▸ (`eventType`: string, `filename`: string | Buffer): _void_

**Parameters:**

| Name        | Type                 |
| ----------- | -------------------- |
| `eventType` | string               |
| `filename`  | string &#124; Buffer |

**Returns:** _this_

▸ **once**(`event`: "error", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[once](#once)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:119

**Parameters:**

▪ **event**: _"error"_

▪ **listener**: _function_

▸ (`error`: Error): _void_

**Parameters:**

| Name    | Type  |
| ------- | ----- |
| `error` | Error |

**Returns:** _this_

▸ **once**(`event`: "close", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[once](#once)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:120

**Parameters:**

▪ **event**: _"close"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

---

### prependListener

▸ **prependListener**(`event`: string, `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependListener](#prependlistener)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:122

**Parameters:**

▪ **event**: _string_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

▸ **prependListener**(`event`: "change", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependListener](#prependlistener)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:123

**Parameters:**

▪ **event**: _"change"_

▪ **listener**: _function_

▸ (`eventType`: string, `filename`: string | Buffer): _void_

**Parameters:**

| Name        | Type                 |
| ----------- | -------------------- |
| `eventType` | string               |
| `filename`  | string &#124; Buffer |

**Returns:** _this_

▸ **prependListener**(`event`: "error", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependListener](#prependlistener)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:124

**Parameters:**

▪ **event**: _"error"_

▪ **listener**: _function_

▸ (`error`: Error): _void_

**Parameters:**

| Name    | Type  |
| ------- | ----- |
| `error` | Error |

**Returns:** _this_

▸ **prependListener**(`event`: "close", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependListener](#prependlistener)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:125

**Parameters:**

▪ **event**: _"close"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

---

### prependOnceListener

▸ **prependOnceListener**(`event`: string, `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependOnceListener](#prependoncelistener)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:127

**Parameters:**

▪ **event**: _string_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

▸ **prependOnceListener**(`event`: "change", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependOnceListener](#prependoncelistener)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:128

**Parameters:**

▪ **event**: _"change"_

▪ **listener**: _function_

▸ (`eventType`: string, `filename`: string | Buffer): _void_

**Parameters:**

| Name        | Type                 |
| ----------- | -------------------- |
| `eventType` | string               |
| `filename`  | string &#124; Buffer |

**Returns:** _this_

▸ **prependOnceListener**(`event`: "error", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependOnceListener](#prependoncelistener)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:129

**Parameters:**

▪ **event**: _"error"_

▪ **listener**: _function_

▸ (`error`: Error): _void_

**Parameters:**

| Name    | Type  |
| ------- | ----- |
| `error` | Error |

**Returns:** _this_

▸ **prependOnceListener**(`event`: "close", `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependOnceListener](#prependoncelistener)_

_Overrides void_

Defined in node_modules/@types/node/fs.d.ts:130

**Parameters:**

▪ **event**: _"close"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

---

### rawListeners

▸ **rawListeners**(`event`: string | symbol): _Function[]_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[rawListeners](#rawlisteners)_

Defined in node_modules/@types/node/globals.d.ts:556

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _Function[]_

---

### removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[removeAllListeners](#removealllisteners)_

Defined in node_modules/@types/node/globals.d.ts:552

**Parameters:**

| Name     | Type                 |
| -------- | -------------------- |
| `event?` | string &#124; symbol |

**Returns:** _this_

---

### removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[removeListener](#removelistener)_

Defined in node_modules/@types/node/globals.d.ts:550

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### setMaxListeners

▸ **setMaxListeners**(`n`: number): _this_

_Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[setMaxListeners](#setmaxlisteners)_

Defined in node_modules/@types/node/globals.d.ts:553

**Parameters:**

| Name | Type   |
| ---- | ------ |
| `n`  | number |

**Returns:** _this_

<a name="modules_dir_md"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd) › ["dir"](#modules_dir_md)

# Module: "dir"

## Index

### Classes

- [Dir](#classes_dir_dirmd)

<a name="modules_file_md"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd) › ["file"](#modules_file_md)

# Module: "file"

## Index

### Classes

- [File](#classes_file_filemd)

<a name="modules_index_md"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd) › ["index"](#modules_index_md)

# Module: "index"

<a name="modules_types_md"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd) › ["types"](#modules_types_md)

# Module: "types"

## Index

### Interfaces

- [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd)

### Type aliases

- [WatchOptions](#watchoptions)
- [obj](#obj)

## Type aliases

### WatchOptions

Ƭ **WatchOptions**: _object_

_Defined in [src/types.ts:9](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/types.ts#L9)_

#### Type declaration:

- **delay**? : _undefined | number_

- **encoding**? : _undefined | string_

- **filter**? : _RegExp | function_

- **persistent**? : _undefined | false | true_

- **recursive**? : _undefined | false | true_

---

### obj

Ƭ **obj**: _object_

_Defined in [src/types.ts:3](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/types.ts#L3)_

#### Type declaration:

- \[ **key**: _string_\]: T
