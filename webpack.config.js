const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/index",
  output: {
    filename: "fs-pro.min.js",
    path: path.join(__dirname, "dist"),
    libraryTarget: "commonjs",
  },
  externals: [nodeExternals()],
  target: "node",
  node: {
    fs: "empty",
    path: "empty",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
