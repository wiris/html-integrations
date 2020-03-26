const path = require('path');

module.exports = {
    entry: {
        app: './src/app.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'demo.js'
    },
    devServer: {
        writeToDisk: true,
        contentBase: path.join(__dirname, ''),
        port: 8006
    },
    resolve: {
        modules: ['node_modules']
    },
    // Set watch to true for dev purposes.
    watch: false,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 8192
                    }
                  }
                ]
            },
            {
                // For the modal close, minimize, maximize icons
                test: /\.svg$/,
                use: [ 'raw-loader' ]
            },
        ]
    },
    stats: {
        colors: true
    }
};