const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");

var config = {
    watch: false,
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
                        presets: ['@babel/env']
                    }
                }
            },
            {
                test: /\.wasm$/,
                type: "asset/inline",
              },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif)$/i,
                type: 'asset/inline',
            },
            {
                // For the modal close, minimize, maximize icons
                test: /\.svg$/,
                type: 'asset/source',
            },
        ]
    },
    stats: {
        colors: true
    },
    experiments: {
        topLevelAwait: true,
        asyncWebAssembly: true
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            'SERVICE_PROVIDER_URI': 'https://www.wiris.net/demo/plugins/app',
            'SERVICE_PROVIDER_SERVER': 'java',
        }),
    ],
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
};

// Use the local integration services
// plugins: [
//     new webpack.EnvironmentPlugin({
//         'SERVICE_PROVIDER_URI': 'http://localhost:8080/wp-includes/js/tinymce/plugins/tiny_mce_wiris/integration',
//         'SERVICE_PROVIDER_SERVER': 'php',
//     }),
// ],

// Use the cloud integration services
// plugins: [
//     new webpack.EnvironmentPlugin({
//         'SERVICE_PROVIDER_URI': 'https://www.wiris.net/demo/plugins/app',
//         'SERVICE_PROVIDER_SERVER': 'java',
//     }),
// ],

var config_min = Object.assign({}, config, {
    name: "config_min",
    entry: "../tinymce5/global.js",
    output: {
        path: __dirname + "/build",
        publicPath: "/",
        filename: "plugin.min.js"
    },
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
    }
});

var config_js = Object.assign({}, config, {
    name: "config_js",
    entry: "../tinymce5/global.js",
    output: {
        path: __dirname + "/build",
        publicPath: "/",
        filename: "plugin.js"
    },
    optimization: {
        minimize: false,
        minimizer: [new TerserPlugin({
            // These options prevent Terser from generating a LICENSE.txt file
            terserOptions: {
                format: {
                    comments: false,
                },
            },
            extractComments: false,
        })],
    }
});

// Return Array of Configurations
module.exports = [config_min, config_js];