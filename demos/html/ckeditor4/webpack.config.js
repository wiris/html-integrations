const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (config, context) => {
  return {
    entry: {
      app: path.resolve(__dirname, 'src/app.js'),
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'demo.js',
    },
    devServer: {
      devMiddleware: {
        writeToDisk: true,
      },
      static: {
        directory: path.join(__dirname, "./")
      },
      onListening: !config.devServer ? '' : config.devServer.onListening,
      open: true,
      port: 8001,
      hot: true,
      host: '0.0.0.0'
    },
    // Set watch to true for dev purposes.
    watch: false,
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: `${path.dirname(require.resolve(`ckeditor4`))}`,
            to: path.resolve(__dirname, "dist/ckeditor4"),
          },
        ],
      }),
    ],
    mode: 'none',
    module: {
      rules: [
        {
          // Rule to translate ES5 javascript files to ES6.
          test: /\.js$/,
          exclude: /node_modules\/(?!(@wiris\/mathtype-html-integration-devkit)\/).*/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env'],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },
        {
          // For the modal close, minimize, maximize icons
          test: /\.svg$/,
          use: ['raw-loader'],
        },
        {
          test: /\.html$/i,
          exclude: /node_modules/,
          loader: 'html-loader',
        },
      ],
    },
    stats: {
      colors: true,
    },
  }
};
