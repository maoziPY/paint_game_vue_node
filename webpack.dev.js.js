const path = require('path');

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
    // webpack4.0不再支持CommonsChunkPlugin的替代方案
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
}