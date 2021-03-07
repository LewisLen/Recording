const Path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
          // 'style-loader',
          // 有了MiniCssExtractPlugin就不需要style-loader了，会直接将css提取出来
          MiniCssExtractPlugin.loader,
          // 将css文件变成commonjs模块加载js中
          'css-loader'
        ],
      },
      {
        // Loader配置,设置规则
        test:/\.less$/,
        // Loader是从右到左执行
        use:[
          // 创建style标签，将js中的css样式资源插入到head中
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          // 将css文件变成commonjs模块加载js中
          'css-loader',
          // 将less编译成css
          'less-loader'
        ]
      },
      {
        test:/\.(jpg|png|jpeg|gif)$/,
        loader: 'url-loader',
        options:{
          // 小于10kb则会处理成base64格式
          limit: 10*1024
        }
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // 会在打包好的bundle.js后面加上hash串
      hash: true
    }),
    // 抽取css文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:8].css'
    })
  ],
  mode: 'development',
  // mode: 'production'
  devServer:{
    contentBase: Path.resolve(__dirname,'dist'),
    // 启动gzip压缩
    compress: true,
    port: 2333,
    open: true
  }
}