const path = require("path");
const webpack = require("webpack");

module.exports = (config, context) => {
  return {
    mode: "development",
    entry: {
      app: path.resolve(__dirname, "src/app.js"),
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "demo.js",
    },
    devServer: {
      devMiddleware: {
        writeToDisk: true,
      },
      static: {
        directory: path.join(__dirname, "./"),
      },
      onListening: !config.devServer ? "" : config.devServer.onListening,
      open: true,
      port: 8003,
      hot: true,
      host: "0.0.0.0",
    },
    watch: false,
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          CK5_LICENSE_KEY: JSON.stringify(process.env.CK5_LICENSE_KEY),
        },
      }),
    ],
    mode: "none",
    module: {
      rules: [
        {
          test: /\.svg$/,
          type: "asset/source",
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader",
              options: {
                injectType: "singletonStyleTag",
                attributes: {
                  "data-cke": true,
                },
              },
            },
            "css-loader",
          ],
        },
        {
          test: /\.html$/i,
          exclude: /node_modules/,
          loader: "html-loader",
        },
      ],
    },
    devtool: "source-map",
    performance: { hints: false },
  };
};
