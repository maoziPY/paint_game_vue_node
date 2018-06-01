/*const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'none',
	entry: {
		main: './server/static/main.js',
		socket: './server/static/common/socket.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './server/static/dist')
	},
	devtool: 'inline-source-map',
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: 'vendor',
                    enforce: true,
                },
            },
        },
    }
}*/