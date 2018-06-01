const path = require('path');

module.exports = {
	mode: 'none',
	entry: ['./server/static/main.js', './server/static/common/socket.js'],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './server/static/dist')
	},
	devtool: 'inline-source-map',

}