const path = require('path');

module.exports = {
  // Set watch to true for dev purposes.
  watch: false,
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset/inline',
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
