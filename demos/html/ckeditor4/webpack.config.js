const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'demo.js',
  },
  devServer: {
    writeToDisk: true,
    contentBase: path.join(__dirname, ''),
    port: 8001,
    host: 'localhost'
  },
  resolve: {
    modules: ['node_modules'],
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
        { // For CKEditor to be able to fetch the icons at runtime
          from: `${path.dirname(require.resolve(`@wiris/mathtype-ckeditor4`))}`,
          to: path.resolve(__dirname, "node_modules/@wiris/mathtype-ckeditor4"),
        },
      ],
    }),
  ],
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
};
