const Path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/index.js',
  output:{
    filename: 'bundles.js',
    path: Path.resolve(__dirname,'dist')
  },
  module:{
    rules:[
      {
        // Loader配置,设置规则
        // 匹配文件类型
        test:/\.css$/,
        // Loader是从右到左执行
        use:[
          // 创建style标签，将js中的css样式资源插入到head中
          'style-loader',
          // 将css文件变成commonjs模块加载js中
          'css-loader'
        ]
      },
      {
        // Loader配置,设置规则
        test:/\.less$/,
        // Loader是从右到左执行
        use:[
          // 创建style标签，将js中的css样式资源插入到head中
          'style-loader',
          // 将css文件变成commonjs模块加载js中
          'css-loader',
          // 将less编译成css
          'less-loader'
        ]
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: './src/index.html',
    })
  ],
  mode: 'development'
  // mode: 'production'
}