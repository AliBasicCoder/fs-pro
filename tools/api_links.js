// this script prints all api links
/* eslint-disable no-console */
const { File, Dir, Shape } = require("../dist/fs-pro");
const file_link =
  "https://fs-pro-docs.herokuapp.com/classes/_src_file_.file.html";
const dir_link = "https://fs-pro-docs.herokuapp.com/classes/_src_dir_.dir.html";
const shape_link =
  "https://fs-pro-docs.herokuapp.com/classes/_src_shape.shape.html";

function log(link) {
  return (item) => {
    console.log(`  -  [${item}](${link}#${item.toLowerCase()})`);
  };
}

console.log(`- [File](${file_link})\n`);
Object.keys(new File(__dirname, "test-file")).forEach(log(file_link));
Object.keys(File.prototype).forEach(log(file_link));
Object.keys(File).forEach(log(file_link));

console.log(`\n- [Dir](${dir_link})\n`);
Object.keys(new Dir(__dirname)).forEach(log(dir_link));
Object.keys(Dir.prototype).forEach(log(dir_link));
Object.keys(Dir).forEach(log(dir_link));

console.log(`\n- [Shape](${shape_link})\n`);
Object.keys(new Shape({})).forEach(log(shape_link));
Object.keys(Shape.prototype).forEach(log(shape_link));
Object.keys(Shape).forEach(log(shape_link));
