// webpack.config.js


const path = require('path');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

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
    port: 8002,
    host: '0.0.0.0'
  },

  module: {
    rules: [
      {
        test: /\.svg$/,

        use: ['raw-loader'],
      },
      {
        test: /\.css$/,

        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'singletonStyleTag',
            },
          },
          {
            loader: 'postcss-loader',
            options: styles.getPostCssConfig({
              themeImporter: {
                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
              },
              minify: true,
            }),
          },
        ],
      },
      {
        test: /\.html$/i,
        exclude: /node_modules/,
        loader: 'html-loader',
      },
    ],
  },

  // Useful for debugging.
  devtool: 'source-map',

  // By default webpack logs warnings if the bundle is bigger than 200kb.
  performance: { hints: false },
};
