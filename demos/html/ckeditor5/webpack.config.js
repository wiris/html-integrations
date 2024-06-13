const path = require("path");

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
      port: 8002,
      hot: true,
      host: "0.0.0.0",
    },
    // Set watch to true for dev purposes.
    watch: false,
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
    // Useful for debugging.
    devtool: "source-map",
    // By default webpack logs warnings if the bundle is bigger than 200kb.
    performance: { hints: false },
  };
};
