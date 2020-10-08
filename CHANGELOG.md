# Change log

## v3.0.0 Sep 30, 2020

a breaking changes version

**Added:**

- Shape Class
- static File.tmpFile() and Dir.tmpDir() methods
- CHANGELOG.md
- Dir.moveTo() and Dir.copyTo()
- "createParents" options in Dir.createFile() and Dir.createDir()

**Removed:**

- Model Class
- Structure Class

**Improvements:**

- Splitting testing into multiple files
- Change testing to use tmp files and folders
- Prevent addPlugin from overwriting Class' native methods
- Change File.validator from receiving the file content in string to nothing
- Change File.validator to return and array of Error or nothing
- Changing Dir.delete() to use the "recursive" options instead of manual deleting
- Prevent addPlugin form loading a plugin twice

## v3.1.0 Oct 1, 2020

**Fix:**

- Some method "return this"

## v3.2.0 Oct 3, 2020

**Improvements:**

- Switching watch lib to "chokidar"
- Add testing for File.watch() and Dir.watch() and unwatch
- Adding private property "watcher" to File
- Changing API for File.watch() and Dir.watch()
- Fixing Bug found in Shape.createShapeInst()

## v3.3.0 Oct 5, 2020

**Fix:**

- Shape typing issues

## v3.4.0 Oct 8, 2020

**Remove:**

- File.createReadStream()
- File.createWriteStream()

**Improvements:**

- Support Deno
