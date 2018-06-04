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


/* 引入操作路径模块和webpack */
var path = require('path');
var webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'none',
    /* 输入文件 */
    entry: './src/main.js',
    output: {
        /* 输出目录，没有则新建 */
        path: path.resolve(__dirname, './dist'),
        /* 静态目录，可以直接从这里取文件 */
        publicPath: '/dist/',
        /* 文件名 */
        filename: 'build.js'
    },
    module: {
        rules: [
            /* 用来解析vue后缀的文件 */
            {
                test: /\.vue$/,
                loader: 'vue-loader'

            },
            /* 用babel来解析js文件并把es6的语法转换成浏览器认识的语法 */
            {
                test: /\.js$/,
                loader: 'babel-loader',
                /* 排除模块安装目录的文件 */
                exclude: /node_modules/
            },
            // 解析vue文件中的css引入的样式
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}