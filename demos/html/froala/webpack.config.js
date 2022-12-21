const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
      port: 8004,
      hot: true,
      host: '0.0.0.0'
    },
    // Set watch to true for dev purposes.
    watch: false,
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: `${path.dirname(require.resolve(`froala-editor`))}`,
            to: path.resolve(__dirname, "dist/froala-editor"),
          },
        ],
      }),
    ],
    mode: 'none',
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
    experiments: {
      topLevelAwait: true,
      asyncWebAssembly: true
    },
  }
}
