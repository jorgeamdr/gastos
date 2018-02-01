const path = require('path');

module.exports = {
    entry: './api/server.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server-bundle.js'
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    node: {
        __dirname: false
    },
    target: 'node', // in order to ignore built-in modules like path, fs, etc. 
};