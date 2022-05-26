# Notes on some old api

if you use fs-pro v3.7.3 or older you might have see some warns with codes

## W00

`W00: looks like the pattern you entered is a static file name please use a Shape Object instead https://github.com/AliBasicCoder/fs-pro/blob/master/NOTES.md`

this warn will occur if you do something like this

```js
const shape = new Shape({
  some_dir: Shape.Dir("some_dir", Shape.Pattern("index.js")),
});
```

the above shape means the you want a folder named "some_dir"

which contains a file named "index.js"

the problem is that `index.js` isn't a pattern (since it will only match index.js)

so it doesn't make since to use Shape.Pattern

### Solution

do this instead

```js
const shape = new Shape({
  some_dir: Shape.Dir("some_dir", {
    index: Shape.File("index.js"),
  }),
});
```

## W01

`W01: looks like you passed a pattern to Shape.File use Shape.Pattern instead https://github.com/AliBasicCoder/fs-pro/blob/master/NOTES.md`

this warn will occur if you do something like this

```js
const shape = new Shape({
  some_dir: Shape.Dir("some_dir", Shape.File("*.js")),
});
```

the problem is that Shape.File here is used a pattern

while it should only be used as a file

the reason this is a warn not a error is that Shape.Pattern didn't exists in v3.7.3 and older

which made Shape.File a lit bit confusing

### Solution

do this

```js
const shape = new Shape({
  //  replace Shape.File with Shape.Pattern
  some_dir: Shape.Dir("some_dir", Shape.Pattern("*.js")),
});
```

## W02

`W02: please use __rest symbol instead of "__rest" https://github.com/AliBasicCoder/fs-pro/blob/master/NOTES.md`

this warn will occur if you do something like this

```js
import { Shape, __rest } from "fs-pro";

const shape = new Shape({
  __rest: Shape.Pattern("*.js"),
});
```

\_\_rest means anything else in the folder

the problem is that \_\_rest is string key which made some typing nonsense in typescript

in v3.7.3 or older \_\_rest symbol didn't exists

### Solution

```js
import { Shape, __rest } from "fs-pro";

const shape = new Shape({
  // this is a symbol
  [__rest]: Shape.Pattern("*.js"),
});
```

## W03

`W03: 'exits' is deprecated use 'exists' instead`

in version 3.11.0 and before methods 'exists' on File and Dir where named incorrectly to 'exits'

so this fixes it

### Solution

```js
file.exists();
// or
dir.exists();
```
