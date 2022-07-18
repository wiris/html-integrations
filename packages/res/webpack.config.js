const path = require('path');

module.exports = {
  // Set watch to true for dev purposes.
  watch: false,
  module: {
    rules: [
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
    ],
  },
  stats: {
    colors: true,
  },
};
