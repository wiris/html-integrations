const path = require("path");
const webpack = require("webpack");

module.exports = (config) => {
  const demoPort = Number(process.env.CK5_DEMO_PORT) || 8013;

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
      port: demoPort,
      hot: true,
      host: "0.0.0.0",
    },
    watch: false,
    mode: "none",
    plugins: [
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(process.env),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.svg$/,
          type: "asset/source",
        },
        {
          test: /\.(js|ts)$/,
          exclude: (modulePath) =>
            /node_modules/.test(modulePath) &&
            !/@wiris[\/\\]mathtype\.integrations\.sdk/.test(modulePath),
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-typescript"],
            },
          },
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
