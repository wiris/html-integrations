var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: './global.js'
    },
    // Set watch to true for dev purposes.
    watch: false,
    output: {
        path: path.resolve(__dirname, ''),
        filename: 'wirisplugin-generic.js',
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