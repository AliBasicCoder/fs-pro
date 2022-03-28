// this script prints all api links
/* eslint-disable no-console */
const { File, Dir, Shape } = require("../dist/main");
const file_link =
  "https://alibasiccoder.github.io/fs-pro/classes/_file_.file.html";
const dir_link =
  "https://alibasiccoder.github.io/fs-pro/classes/_dir_.dir.html";
const shape_link =
  "https://alibasiccoder.github.io/fs-pro/classes/_shape_.shape.html";

function log(link) {
  return (item) => {
    console.log(`  -  [${item}](${link}#${item.toLowerCase()})`);
  };
}

function log2(link, name, br = 0) {
  console.log(
    `${br >= 2 ? "\n" : ""}- [${name}](${link})${
      br === 1 || br === 2 ? "\n" : ""
    }`
  );
}

log2(file_link, "File", 1);
Object.keys(new File(__dirname, "test-file")).forEach(log(file_link));
Object.keys(File.prototype).forEach(log(file_link));
Object.keys(File).forEach(log(file_link));

log2(dir_link, "Dir", 2);
Object.keys(new Dir(__dirname)).forEach(log(dir_link));
Object.keys(Dir.prototype).forEach(log(dir_link));
Object.keys(Dir).forEach(log(dir_link));

log2(shape_link, "Shape", 2);
Object.keys(new Shape({})).forEach(log(shape_link));
Object.keys(Shape.prototype).forEach(log(shape_link));
Object.keys(Shape).forEach(log(shape_link));

log2(
  "https://alibasiccoder.github.io/fs-pro/modules/_pluginadder_.html#addplugin",
  "addPlugin",
  3
);
log2(
  "https://alibasiccoder.github.io/fs-pro/modules/_pluginadder_.html#getplugintrack",
  "getPluginTrack"
);

log2(
  "https://alibasiccoder.github.io/fs-pro/modules/_pluginadder_.html#getplugintrackformatted",
  "getPluginTrackFormatted"
);

log2("https://alibasiccoder.github.io/fs-pro/modules/_fs_.html#setfs", "setFs");
