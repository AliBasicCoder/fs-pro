<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [fs-pro](#fs-pro)
- [fs-pro](#fs-pro-1)
  - [Usage](#usage)
  - [Licence](#licence)
- [fs-pro](#fs-pro-2)
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

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


<a name="readmemd"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd)

# fs-pro

# fs-pro

a library to work with files as objects

see the full docs [here](https://alibasiccoder.github.io/fs-pro/)

## Usage

```js
import { File } from "fs-pro";

const file = new File("hello_world.txt");

file.write("hello").append("world");
// ...
```

## Licence

copyright (c) AliBasicCoder 2020


<a name="globalsmd"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd)

# fs-pro

## Index

### Modules

* ["dir"](#modules_dir_md)
* ["file"](#modules_file_md)
* ["index"](#modules_index_md)
* ["types"](#modules_types_md)


<a name="classes_dir_dirmd"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd) › ["dir"](#modules_dir_md) › [Dir](#classes_dir_dirmd)

# Class: Dir

## Hierarchy

* **Dir**

## Index

### Constructors

* [constructor](#constructor)

### Properties

* [name](#name)
* [parentDirectory](#parentdirectory)
* [path](#path)
* [root](#root)
* [watcher](#private-optional-watcher)

### Accessors

* [createdAt](#createdat)
* [lastAccessed](#lastaccessed)
* [lastChanged](#lastchanged)
* [lastModified](#lastmodified)
* [size](#size)

### Methods

* [create](#create)
* [createDir](#createdir)
* [createFile](#createfile)
* [delete](#delete)
* [read](#read)
* [stats](#stats)
* [unwatch](#unwatch)
* [watch](#watch)

## Constructors

###  constructor

\+ **new Dir**(...`args`: string[]): *[Dir](#classes_dir_dirmd)*

*Defined in [src/dir.ts:45](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L45)*

the Dir constructor
NOTE: the path you pass will passed to path.join

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...args` | string[] | the path  |

**Returns:** *[Dir](#classes_dir_dirmd)*

## Properties

###  name

• **name**: *string*

*Defined in [src/dir.ts:17](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L17)*

the name of the directory

___

###  parentDirectory

• **parentDirectory**: *string*

*Defined in [src/dir.ts:23](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L23)*

the directory of the file

___

###  path

• **path**: *string*

*Defined in [src/dir.ts:21](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L21)*

the path of the file

___

###  root

• **root**: *string*

*Defined in [src/dir.ts:19](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L19)*

the root of the file

___

### `Private` `Optional` watcher

• **watcher**? : *[ImprovedFSWatcher](#interfaces_types_improvedfswatchermd)*

*Defined in [src/dir.ts:25](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L25)*

## Accessors

###  createdAt

• **get createdAt**(): *Date*

*Defined in [src/dir.ts:43](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L43)*

The timestamp indicating when the file have been created

**Returns:** *Date*

___

###  lastAccessed

• **get lastAccessed**(): *Date*

*Defined in [src/dir.ts:31](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L31)*

The timestamp indicating the last time this file was accessed.

**Returns:** *Date*

___

###  lastChanged

• **get lastChanged**(): *Date*

*Defined in [src/dir.ts:39](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L39)*

The timestamp indicating the last time this file status was changed.

**Returns:** *Date*

___

###  lastModified

• **get lastModified**(): *Date*

*Defined in [src/dir.ts:35](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L35)*

The timestamp indicating the last time this file was modified.

**Returns:** *Date*

___

###  size

• **get size**(): *number*

*Defined in [src/dir.ts:27](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L27)*

the size of the file

**Returns:** *number*

## Methods

###  create

▸ **create**(): *this*

*Defined in [src/dir.ts:77](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L77)*

creates the directory
example:
```js
dir.create();
```

**Returns:** *this*

___

###  createDir

▸ **createDir**(`dirname`: string): *[Dir](#classes_dir_dirmd)‹›*

*Defined in [src/dir.ts:104](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L104)*

create a directory inside the directory
example:
```js
const subDir = dir.createDir("hello");
subDir.createFile("hello_world.txt");
// ...
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dirname` | string | the name of the directory  |

**Returns:** *[Dir](#classes_dir_dirmd)‹›*

___

###  createFile

▸ **createFile**(`filename`: string): *[File](#classes_file_filemd)‹›*

*Defined in [src/dir.ts:91](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L91)*

create a file inside the directory
example:
```js
const file = dir.createFile("hello_world.txt");
file.write("hello world");
//...
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filename` | string | the file you want to create  |

**Returns:** *[File](#classes_file_filemd)‹›*

___

###  delete

▸ **delete**(): *void*

*Defined in [src/dir.ts:138](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L138)*

deletes the directory even if it's not empty

**Returns:** *void*

___

###  read

▸ **read**(): *string[]*

*Defined in [src/dir.ts:67](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L67)*

reads the directory
example:
```js
console.log(dir.read()) // => ["hello_world.txt", "file2.txt"]
```

**Returns:** *string[]*

___

###  stats

▸ **stats**(): *Stats‹›*

*Defined in [src/dir.ts:147](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L147)*

get the stats of the directory @see https://nodejs.org/api/fs.html#fs_class_fs_stats

**Returns:** *Stats‹›*

___

###  unwatch

▸ **unwatch**(): *this*

*Defined in [src/dir.ts:133](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L133)*

stops watching the directory

**Returns:** *this*

___

###  watch

▸ **watch**(`listener`: function, `options?`: [WatchOptions](#watchoptions)): *[ImprovedFSWatcher](#interfaces_types_improvedfswatchermd)‹›*

*Defined in [src/dir.ts:123](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/dir.ts#L123)*

watches the directory
example:
```js
dir.watch(
 (e, file) => {
   if(e === "update")
     console.log(`file ${file.base} have been updated`);
   else
     console.log(`file ${file.base} have been removed`);
 }
)
```

**Parameters:**

▪ **listener**: *function*

the function will be called when a file changes

▸ (`e`: "update" | "remove", `file`: [File](#classes_file_filemd)): *any*

**Parameters:**

Name | Type |
------ | ------ |
`e` | "update" &#124; "remove" |
`file` | [File](#classes_file_filemd) |

▪`Optional`  **options**: *[WatchOptions](#watchoptions)*

options

**Returns:** *[ImprovedFSWatcher](#interfaces_types_improvedfswatchermd)‹›*


<a name="classes_file_filemd"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd) › ["file"](#modules_file_md) › [File](#classes_file_filemd)

# Class: File

## Hierarchy

* **File**

## Index

### Constructors

* [constructor](#constructor)

### Properties

* [base](#base)
* [directory](#directory)
* [extension](#extension)
* [name](#name)
* [path](#path)
* [root](#root)

### Accessors

* [createdAt](#createdat)
* [lastAccessed](#lastaccessed)
* [lastChanged](#lastchanged)
* [lastModified](#lastmodified)
* [size](#size)

### Methods

* [append](#append)
* [copyTo](#copyto)
* [create](#create)
* [createReadStream](#createreadstream)
* [createWriteStream](#createwritestream)
* [delete](#delete)
* [json](#json)
* [moveTo](#moveto)
* [read](#read)
* [stats](#stats)
* [unwatch](#unwatch)
* [watch](#watch)
* [write](#write)

## Constructors

###  constructor

\+ **new File**(...`args`: string[]): *[File](#classes_file_filemd)*

*Defined in [src/file.ts:50](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L50)*

the File constructor
NOTE: the path you pass will passed to path.join

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...args` | string[] | the path  |

**Returns:** *[File](#classes_file_filemd)*

## Properties

###  base

• **base**: *string*

*Defined in [src/file.ts:24](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L24)*

the name with the extension

___

###  directory

• **directory**: *string*

*Defined in [src/file.ts:30](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L30)*

the directory of the file

___

###  extension

• **extension**: *string*

*Defined in [src/file.ts:22](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L22)*

the extension of the file

___

###  name

• **name**: *string*

*Defined in [src/file.ts:20](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L20)*

the name of the file without the extension

___

###  path

• **path**: *string*

*Defined in [src/file.ts:28](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L28)*

the path of the file

___

###  root

• **root**: *string*

*Defined in [src/file.ts:26](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L26)*

the root of the file

## Accessors

###  createdAt

• **get createdAt**(): *Date*

*Defined in [src/file.ts:48](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L48)*

The timestamp indicating when the file have been created

**Returns:** *Date*

___

###  lastAccessed

• **get lastAccessed**(): *Date*

*Defined in [src/file.ts:36](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L36)*

The timestamp indicating the last time this file was accessed.

**Returns:** *Date*

___

###  lastChanged

• **get lastChanged**(): *Date*

*Defined in [src/file.ts:44](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L44)*

The timestamp indicating the last time this file status was changed.

**Returns:** *Date*

___

###  lastModified

• **get lastModified**(): *Date*

*Defined in [src/file.ts:40](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L40)*

The timestamp indicating the last time this file was modified.

**Returns:** *Date*

___

###  size

• **get size**(): *number*

*Defined in [src/file.ts:32](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L32)*

the size of the file

**Returns:** *number*

## Methods

###  append

▸ **append**(`data`: string | Buffer): *this*

*Defined in [src/file.ts:102](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L102)*

append some data to the file
example:
```js
file.append("hello").append("world").read() // => hello world
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | string &#124; Buffer | data to append  |

**Returns:** *this*

___

###  copyTo

▸ **copyTo**(`destination`: string, `isRelative`: boolean): *[File](#classes_file_filemd)‹›*

*Defined in [src/file.ts:183](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L183)*

copy the file to the destination
example:
```js
const newFile = file.copyTo("./some_dir");
newFile.write("hello world");
// ...
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`destination` | string | - | the destination to copy the file to |
`isRelative` | boolean | true | tells the function if the path is relative or not  |

**Returns:** *[File](#classes_file_filemd)‹›*

___

###  create

▸ **create**(): *this*

*Defined in [src/file.ts:137](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L137)*

creates the file

**Returns:** *this*

___

###  createReadStream

▸ **createReadStream**(): *ReadStream‹›*

*Defined in [src/file.ts:113](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L113)*

creates a read stream for the file
example of copying file content via streams:
```js
fileX.createReadStream().pipe(fileY.createWriteStream());
```

**Returns:** *ReadStream‹›*

___

###  createWriteStream

▸ **createWriteStream**(): *WriteStream‹›*

*Defined in [src/file.ts:123](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L123)*

creates a write stream for the file
example of copying file content via streams:
```js
fileX.createReadStream().pipe(fileY.createWriteStream());
```

**Returns:** *WriteStream‹›*

___

###  delete

▸ **delete**(): *void*

*Defined in [src/file.ts:169](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L169)*

delete the file
```js
file.delete();
fs.existsSync(file.path) // => false
```

**Returns:** *void*

___

###  json

▸ **json**(): *any*

*Defined in [src/file.ts:133](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L133)*

reads the file as json
example:
```js
JsonFile.json() // => { hello: "world" }
```

**Returns:** *any*

___

###  moveTo

▸ **moveTo**(`destination`: string, `isRelative`: boolean): *this*

*Defined in [src/file.ts:199](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L199)*

moves the file to destination
example:
```js
file.moveTo("./newFile.txt");
file.write("hello world");
// ...
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`destination` | string | - | the destination to copy the file to |
`isRelative` | boolean | true | tells the function if the path is relative or not  |

**Returns:** *this*

___

###  read

▸ **read**(): *Buffer‹›*

*Defined in [src/file.ts:91](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L91)*

reads the file
example:
```js
file.read().toString() // => "hello world"
```

**Returns:** *Buffer‹›*

___

###  stats

▸ **stats**(): *Stats‹›*

*Defined in [src/file.ts:159](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L159)*

gets the stats of the file @see https://nodejs.org/api/fs.html#fs_class_fs_stats

**Returns:** *Stats‹›*

___

###  unwatch

▸ **unwatch**(): *this*

*Defined in [src/file.ts:154](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L154)*

stops watching the file

**Returns:** *this*

___

###  watch

▸ **watch**(`listener`: function): *this*

*Defined in [src/file.ts:149](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L149)*

watches the file
```js
file.watch(function (e, filename) {
   console.log(`the file size is: ${this.size}`);
})
```

**Parameters:**

▪ **listener**: *function*

the function the will be called when the file changes

▸ (`this`: [File](#classes_file_filemd), `curr`: Stats, `prev`: Stats): *any*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [File](#classes_file_filemd) |
`curr` | Stats |
`prev` | Stats |

**Returns:** *this*

___

###  write

▸ **write**(`data`: Buffer | string | [obj](#obj)‹any›): *this*

*Defined in [src/file.ts:78](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/file.ts#L78)*

write some data into the file
NOTE: if you pass an object it will be automatically
convert to json
```js
file.write("hello world");
file.write(Buffer.from("hello world"));
file.write({ hello: "world" });
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | Buffer &#124; string &#124; [obj](#obj)‹any› | the data to write  |

**Returns:** *this*


<a name="interfaces_types_improvedfswatchermd"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd) › ["types"](#modules_types_md) › [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd)

# Interface: ImprovedFSWatcher

## Hierarchy

* FSWatcher

  ↳ **ImprovedFSWatcher**

## Index

### Methods

* [addListener](#addlistener)
* [close](#close)
* [emit](#emit)
* [eventNames](#eventnames)
* [getMaxListeners](#getmaxlisteners)
* [isClosed](#isclosed)
* [listenerCount](#listenercount)
* [listeners](#listeners)
* [off](#off)
* [on](#on)
* [once](#once)
* [prependListener](#prependlistener)
* [prependOnceListener](#prependoncelistener)
* [rawListeners](#rawlisteners)
* [removeAllListeners](#removealllisteners)
* [removeListener](#removelistener)
* [setMaxListeners](#setmaxlisteners)

## Methods

###  addListener

▸ **addListener**(`event`: string, `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[addListener](#addlistener)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:107

events.EventEmitter
  1. change
  2. error

**Parameters:**

▪ **event**: *string*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

▸ **addListener**(`event`: "change", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[addListener](#addlistener)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:108

**Parameters:**

▪ **event**: *"change"*

▪ **listener**: *function*

▸ (`eventType`: string, `filename`: string | Buffer): *void*

**Parameters:**

Name | Type |
------ | ------ |
`eventType` | string |
`filename` | string &#124; Buffer |

**Returns:** *this*

▸ **addListener**(`event`: "error", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[addListener](#addlistener)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:109

**Parameters:**

▪ **event**: *"error"*

▪ **listener**: *function*

▸ (`error`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | Error |

**Returns:** *this*

▸ **addListener**(`event`: "close", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[addListener](#addlistener)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:110

**Parameters:**

▪ **event**: *"close"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

___

###  close

▸ **close**(): *void*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[close](#close)*

Defined in node_modules/@types/node/fs.d.ts:100

**Returns:** *void*

___

###  emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): *boolean*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[emit](#emit)*

Defined in node_modules/@types/node/globals.d.ts:557

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |
`...args` | any[] |

**Returns:** *boolean*

___

###  eventNames

▸ **eventNames**(): *Array‹string | symbol›*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[eventNames](#eventnames)*

Defined in node_modules/@types/node/globals.d.ts:562

**Returns:** *Array‹string | symbol›*

___

###  getMaxListeners

▸ **getMaxListeners**(): *number*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[getMaxListeners](#getmaxlisteners)*

Defined in node_modules/@types/node/globals.d.ts:554

**Returns:** *number*

___

###  isClosed

▸ **isClosed**(): *boolean*

*Defined in [src/types.ts:46](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/types.ts#L46)*

Returns `true` if the watcher has been closed.

**Returns:** *boolean*

___

###  listenerCount

▸ **listenerCount**(`type`: string | symbol): *number*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[listenerCount](#listenercount)*

Defined in node_modules/@types/node/globals.d.ts:558

**Parameters:**

Name | Type |
------ | ------ |
`type` | string &#124; symbol |

**Returns:** *number*

___

###  listeners

▸ **listeners**(`event`: string | symbol): *Function[]*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[listeners](#listeners)*

Defined in node_modules/@types/node/globals.d.ts:555

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  off

▸ **off**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[off](#off)*

Defined in node_modules/@types/node/globals.d.ts:551

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  on

▸ **on**(`event`: string, `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[on](#on)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:112

**Parameters:**

▪ **event**: *string*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

▸ **on**(`event`: "change", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[on](#on)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:113

**Parameters:**

▪ **event**: *"change"*

▪ **listener**: *function*

▸ (`eventType`: string, `filename`: string | Buffer): *void*

**Parameters:**

Name | Type |
------ | ------ |
`eventType` | string |
`filename` | string &#124; Buffer |

**Returns:** *this*

▸ **on**(`event`: "error", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[on](#on)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:114

**Parameters:**

▪ **event**: *"error"*

▪ **listener**: *function*

▸ (`error`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | Error |

**Returns:** *this*

▸ **on**(`event`: "close", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[on](#on)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:115

**Parameters:**

▪ **event**: *"close"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

___

###  once

▸ **once**(`event`: string, `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[once](#once)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:117

**Parameters:**

▪ **event**: *string*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

▸ **once**(`event`: "change", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[once](#once)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:118

**Parameters:**

▪ **event**: *"change"*

▪ **listener**: *function*

▸ (`eventType`: string, `filename`: string | Buffer): *void*

**Parameters:**

Name | Type |
------ | ------ |
`eventType` | string |
`filename` | string &#124; Buffer |

**Returns:** *this*

▸ **once**(`event`: "error", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[once](#once)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:119

**Parameters:**

▪ **event**: *"error"*

▪ **listener**: *function*

▸ (`error`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | Error |

**Returns:** *this*

▸ **once**(`event`: "close", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[once](#once)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:120

**Parameters:**

▪ **event**: *"close"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

___

###  prependListener

▸ **prependListener**(`event`: string, `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependListener](#prependlistener)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:122

**Parameters:**

▪ **event**: *string*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

▸ **prependListener**(`event`: "change", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependListener](#prependlistener)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:123

**Parameters:**

▪ **event**: *"change"*

▪ **listener**: *function*

▸ (`eventType`: string, `filename`: string | Buffer): *void*

**Parameters:**

Name | Type |
------ | ------ |
`eventType` | string |
`filename` | string &#124; Buffer |

**Returns:** *this*

▸ **prependListener**(`event`: "error", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependListener](#prependlistener)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:124

**Parameters:**

▪ **event**: *"error"*

▪ **listener**: *function*

▸ (`error`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | Error |

**Returns:** *this*

▸ **prependListener**(`event`: "close", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependListener](#prependlistener)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:125

**Parameters:**

▪ **event**: *"close"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

___

###  prependOnceListener

▸ **prependOnceListener**(`event`: string, `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependOnceListener](#prependoncelistener)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:127

**Parameters:**

▪ **event**: *string*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

▸ **prependOnceListener**(`event`: "change", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependOnceListener](#prependoncelistener)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:128

**Parameters:**

▪ **event**: *"change"*

▪ **listener**: *function*

▸ (`eventType`: string, `filename`: string | Buffer): *void*

**Parameters:**

Name | Type |
------ | ------ |
`eventType` | string |
`filename` | string &#124; Buffer |

**Returns:** *this*

▸ **prependOnceListener**(`event`: "error", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependOnceListener](#prependoncelistener)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:129

**Parameters:**

▪ **event**: *"error"*

▪ **listener**: *function*

▸ (`error`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | Error |

**Returns:** *this*

▸ **prependOnceListener**(`event`: "close", `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[prependOnceListener](#prependoncelistener)*

*Overrides void*

Defined in node_modules/@types/node/fs.d.ts:130

**Parameters:**

▪ **event**: *"close"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

___

###  rawListeners

▸ **rawListeners**(`event`: string | symbol): *Function[]*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[rawListeners](#rawlisteners)*

Defined in node_modules/@types/node/globals.d.ts:556

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[removeAllListeners](#removealllisteners)*

Defined in node_modules/@types/node/globals.d.ts:552

**Parameters:**

Name | Type |
------ | ------ |
`event?` | string &#124; symbol |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[removeListener](#removelistener)*

Defined in node_modules/@types/node/globals.d.ts:550

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  setMaxListeners

▸ **setMaxListeners**(`n`: number): *this*

*Inherited from [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd).[setMaxListeners](#setmaxlisteners)*

Defined in node_modules/@types/node/globals.d.ts:553

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *this*


<a name="modules_dir_md"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd) › ["dir"](#modules_dir_md)

# Module: "dir"

## Index

### Classes

* [Dir](#classes_dir_dirmd)


<a name="modules_file_md"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd) › ["file"](#modules_file_md)

# Module: "file"

## Index

### Classes

* [File](#classes_file_filemd)


<a name="modules_index_md"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd) › ["index"](#modules_index_md)

# Module: "index"




<a name="modules_types_md"></a>

[fs-pro](#readmemd) › [Globals](#globalsmd) › ["types"](#modules_types_md)

# Module: "types"

## Index

### Interfaces

* [ImprovedFSWatcher](#interfaces_types_improvedfswatchermd)

### Type aliases

* [WatchOptions](#watchoptions)
* [obj](#obj)

## Type aliases

###  WatchOptions

Ƭ **WatchOptions**: *object*

*Defined in [src/types.ts:9](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/types.ts#L9)*

#### Type declaration:

* **delay**? : *undefined | number*

* **encoding**? : *undefined | string*

* **filter**? : *RegExp | function*

* **persistent**? : *undefined | false | true*

* **recursive**? : *undefined | false | true*

___

###  obj

Ƭ **obj**: *object*

*Defined in [src/types.ts:3](https://github.com/AliBasicCoder/fs-pro/blob/9030265/src/types.ts#L3)*

#### Type declaration:

* \[ **key**: *string*\]: T
