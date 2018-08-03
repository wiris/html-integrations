var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/global.js'
    },
    // Set watch to true for dev purposes.
    watch: false,
    // watch: true,
    output: {
        path: path.resolve(__dirname, ''),
        // Change the path for dev purposes.
        // path: path.resolve('/htdocs/plugin/3.50/generic_wiris/generic_wiris/core', ''),
        filename: 'core.js',
        libraryTarget: 'var',
        library: 'WirisPlugin'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015-ie']
                }
            }
        ],
    },
    stats: {
        colors: true
    }
};