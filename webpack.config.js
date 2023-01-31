const webpack = require("webpack");
const path = require("path");

const config = {
  entry: "./frontend-js/main.js",
  output: {
    filename: "main-bundled.js",
    path: path.resolve(__dirname, "public"),
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = config;
