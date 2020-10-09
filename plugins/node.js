const { createReadStream, createWriteStream } = require("fs");

const plg = {
  name: "fs-pro/node",
  desc: "a plugin to add function that are only available on node",
  plugin: [
    {
      methodName: "createReadStream",
      className: "File",
      isStatic: false,
      func: function () {
        return createReadStream(this.path);
      },
    },
    {
      methodName: "createWriteStream",
      className: "File",
      isStatic: false,
      func: function () {
        return createWriteStream(this.path);
      },
    },
  ],
};

module.exports = plg;
module.exports.default = { ...plg };
