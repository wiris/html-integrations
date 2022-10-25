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
    port: 8008,
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
          from: `${path.dirname(require.resolve(`tinymce`))}`,
          to: path.resolve(__dirname, "dist/tinymce"),
        },
        {
          from: `${path.dirname(require.resolve(`@wiris/mathtype-tinymce6`))}/plugin.min.js`,
          to: path.resolve(__dirname, "dist/plugin.min.js"),
        },
      ],
    }),
  ],
  module: {
    rules: [
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
