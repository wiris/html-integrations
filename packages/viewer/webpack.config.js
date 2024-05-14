const path = require("path");

module.exports = (config, context) => {
  return {
    entry: "./src/app.ts",
    mode: "none",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "WIRISplugins.js",
      path: path.resolve(__dirname, "dist"),
    },
    devServer: {
      devMiddleware: {
        writeToDisk: true,
      },
      static: "./",
      hot: true,
      port: 8001,
      open: true,
    },
    optimization: {
      minimize: true, // enabling this reduces file size and readability
    },
  };
};
