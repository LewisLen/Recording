const Path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: {
        // [name]: [库名]
        vue: ['vue'],
        jquery: ['jquery']
    },
    output: {
        filename: '[name].js',
        path: Path.resolve(__dirname,'dll'),
        library: '[name]_[hash]'// 打包之后暴露出去的内容名称
    },
    plugins:[
        new webpack.DllPlugin({
            // 生成一个映射库名称
            name: '[name]_[hash]',
            // 文件路径
            path: Path.resolve(__dirname,'dll/manifest.json')
        })
    ]
}