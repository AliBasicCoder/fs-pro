const fs = require("fs");
const path = require("path");

function traverseDirectory(dir, callback) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath, callback);
    } else if (fullPath.endsWith(".d.ts") || fullPath.endsWith(".js")) {
      callback(fullPath);
    }
  }
}

traverseDirectory(path.join(__dirname, "../dist"), (file) => {
  console.log(`replaced file: ${file}`);

  fs.writeFileSync(
    file,
    fs
      .readFileSync(file, "utf-8")
      .replaceAll(/\.?\.\/[\w\.]*/g, (s) =>
        s.slice(0, s.lastIndexOf(".") || undefined)
      )
  );
});
