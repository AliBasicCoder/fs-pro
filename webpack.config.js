const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: {
    main: "./src/index",
    test: "./test/deno/target",
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist"),
    libraryTarget: "commonjs",
  },
  externals: [nodeExternals()],
  target: "node",
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
