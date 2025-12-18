const path = require("node:path");

function createConfig(config, context) {
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
      onListening: config.devServer ? config.devServer.onListening : "",
      open: true,
      port: 8002,
      hot: true,
      host: "0.0.0.0",
    },
    // Set watch to true for dev purposes.
    watch: false,
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
        // CKEditor and premium-features CSS: inject as singleton with data-cke attribute
        {
          test: /(ckeditor5|ckeditor5-premium-features)\/.*\.css$/,
          use: [
            {
              loader: "style-loader",
              options: {
                injectType: "singletonStyleTag",
                attributes: { "data-cke": true },
              },
            },
            "css-loader",
          ],
        },
        // App CSS: regular injection without data-cke
        {
          test: /\.css$/,
          exclude: /(ckeditor5|ckeditor5-premium-features)\/.*\.css$/,
          use: [
            {
              loader: "style-loader",
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
}

module.exports = createConfig;
