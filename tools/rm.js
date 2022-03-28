// this script removes all .ts from imports in generated .d.ts files from webpack
/* eslint-disable no-console */
const { Dir } = require("../dist/main.js");

const importRegex = /import (type )?(\{[\w, ]*\}) from "([^"]*)"/;

function removeTs(str) {
  if (str.endsWith(".ts")) return str.slice(0, -3);
  else return str;
}

new Dir(__dirname, "../types/src").forEachFile((file) => {
  file.overwrite("\n", (line) => {
    if (line.startsWith("import")) {
      const res = importRegex.exec(line);
      return `import ${res[1] || ""} ${res[2]} from "${removeTs(res[3])}";\n`;
    } else return line + "\n";
  });
});
