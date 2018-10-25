/* 引入操作路径模块和webpack */
var path = require('path');
var webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'none',
    /* 输入文件 */
    entry: './src/main.js',
    output: {
        /* 输出目录，没有则新建 */
        path: path.resolve(__dirname, './server/static/dist'),
        // path: path.resolve(__dirname, './dist'),
        /* 静态目录，可以直接从这里取文件 */
        // publicPath: '/dist/',
        /* 文件名 */
        filename: '[name].build.[hash].js'
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
        new CleanWebpackPlugin(['./server/static/dist']),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title: '你画我猜',
            template: './index.html',
            inject: 'body'
        })
    ]
}