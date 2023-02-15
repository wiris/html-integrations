const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: {
      app: './src/global.js'
    },
    output: {
      path: path.resolve(__dirname, ''),
      filename: 'core.js',
      globalObject: 'this',
    },
    // Set watch to true for dev purposes.
    watch: false,
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        // These options prevent Terser from generating a LICENSE.txt file
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      })],
    },
    module: {
      rules: [
        {
          // Rule to translate ES5 javascript files to ES6.
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.wasm$/,
          type: "asset/inline",
        },
        {
          // For the modal close, minimize, maximize icons
          test: /styles\/icons\/[^\/]+\/[^\/]+\.svg$/,
          use: [ 'raw-loader' ]
        },
        {
          test: /\.(png|ttf|otf|eot|svg|woff(2)?)(.*)?$/,
          exclude: /styles\/icons\/[^\/]+\/[^\/]+\.svg$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ]
        }
      ]
    },
    experiments: { 
      topLevelAwait: true, 
      asyncWebAssembly: true 
    },
    stats: {
      colors: true
    }
};
