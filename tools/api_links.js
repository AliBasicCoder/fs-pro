// this script prints all api links
/* eslint-disable no-console */
const { File, Dir, Shape } = require("../dist/fs-pro");
const file_link =
  "https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html";
const dir_link = "https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html";
const shape_link =
  "https://fs-pro-docs.herokuapp.com/classes/_src_shape_.shape.html";

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
  "https://fs-pro-docs.herokuapp.com/modules/_src_pluginadder_.html#addplugin",
  "addPlugin",
  3
);
log2(
  "https://fs-pro-docs.herokuapp.com/modules/_src_pluginadder_.html#getplugintrack",
  "getPluginTrack"
);

log2(
  "https://fs-pro-docs.herokuapp.com/modules/_src_pluginadder_.html#getplugintrackformatted",
  "getPluginTrackFormatted"
);

log2("https://fs-pro-docs.herokuapp.com/modules/_src_fs_.html#setfs", "setFs");
