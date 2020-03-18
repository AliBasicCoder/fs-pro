const path = require("path");

module.exports = {
  entry: "./src/index",
  output: {
    filename: "fs-pro.min.js",
    path: path.join(__dirname, "dist"),
    libraryTarget: "commonjs",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  }
}