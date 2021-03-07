# 从0到1回顾学习webpack

17年接触了webpack，那会儿自己一个人看官方文档，看vue-cli来学习配置webpack，现在webpack已经更新到5.0版本了，当然大部分公司现在用的依然是4.0版本。其实4.0和5.0知识点和配置大同小异。本文从0开始，重新整理文档回顾webpack，一步一步搭建webpack。

## 安装

第一步当然是安装了，打开cmd命令行工具，全局安装，配置好环境变量之后就能直接在命令上执行webpack的默认配置

```shell
# webpack4.0版本除了webpack之外，还需要安装webpack-cli
npm i webpack webpack-cli -g
```

> -g表示全局安装，正常情况下，npm全局安装的依赖包会在 /usr/local/lib/node_modules (Mac电脑)、\Users\Administrator\AppData\Roaming\npm\node_module(window7电脑)
> 也可以切换taobao镜像资源来下载依赖包npm i webpack webpack-cli -g --registry=https://registry.npm.taobao.org

## webpack初体验

webpack有最重要的四个核心的概念：`entry`、`output`、`module`、`plugins`。webpack默认的配置文件为webpack.config.js，新建一个`webpack.config.js`配置文件，执行`npm init --yes`或者`npm init -y`命令来快速生成一个`json`文件，`json`文件会记录依赖包的信息以及做些打包命令设置。

```javascript
// webpack.config.js
module.exports = {
  entry: '', // 入口，要打包哪些文件，可以1个文件或者多个文件一起打包
  output:{}, // 打包后输出资源bundles的一些信息设置
  Loader:{}, // 因webpack只能处理js文件，通过Loader来处理一些非js文件，如less、scss等
  plugins:[] // 补充一些功能强大的插件，如压缩，自动在html文件中插入引用等
}
```

创建如下结构：

```shell

# 文件结构
├── package.json
├── src
│   ├── assets
│   │   ├── css
│   │   └── less
│   ├── index.html
│   └── index.js
├── statics
│   └── images
│       ├── react.jpg
│       └── vue.png
└── webpack.config.js

```

当前文件夹下安装webapck(需要关注package.json中记录的版本号)

```shell
# 安装webpack
npm i webpack webapck-cli -D
```

> -D 是 --save-dev的缩写，会记录到package.json的devdependencies中，配置的是开发环境项目开发时所依赖的模块，如webpack，loader和plugin等
> -S 是 --save的缩写，会记录到package.json的dependencies中，配置的是生产环境项目开发时所依赖的模块，如Vue、React和JQuery等

在index.js中写一些js代码，就可以在命令行中执行webpack命令来打包了，也可以在package.json设置一些命令

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  },
```

因为以后还需要设置一些webpack相关设置，为了不需要每次都输入那么长的命令，设置成简短的命令，这样就能在命令行中执行`npm run build`进行打包了

```javascript
// webpack.config.js
const Path = require("path"); // 引用node中的path模块
module.exports = {
  entry: './src/index.js',
  output:{
    filename: 'bundles.js',
    path: Path.resolve(__dirname,'dist')
  }
}
```

这里设置了index.js为入口，所以会将index.js引用到的js或者css文件也打包进来，打包后会在当前文件夹的根目录下生成一个dist文件夹，bundles.js文件就是打包后的文件，里边就包含了js、css文件等

## 通过Loader打包CSS和Less等预处理语言（ES6和TS语言同理）

webpack 只能理解 JavaScript 和 JSON 文件，这是 webpack 开箱可用的自带能力。对于入口文件中import导入的css语言是不能够做处理的，所以需要借助loader来处理，安装相关依赖

```shell
# 安装依赖
npm i style-loader css-loader less-loader less -D
```

配置Loader，打包css和less

```javascript

module:{
  // Loader配置,设置规则
  rules:[
    {
      // 匹配文件类型
      test:/\.css$/,
      // Loader是从右到左（从下到上）执行
      use:['style-loader','css-loader']
    },
    {
      // 匹配less
      test:/\.less$/,
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
```

## 通过plugin来将打包后的文件插入到html中

通过上边的一系列配置，发现打包后只有一个bundles.js文件，而且打开html文件是没有效果的，因为没有将打包后bundles文件引入到html中，这一步必须通过插件来完成。

```shell
# 安装插件
npm i webpack-html-plugin -D
```

配置plugin

```javascript

module:{
  // Loader配置,设置规则
  rules:[
    {
      // 匹配文件类型
      test:/\.css$/,
      // Loader是从右到左（从下到上）执行
      use:['style-loader','css-loader']
    },
    {
      // 匹配less
      test:/\.less$/,
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
```

## 打包图片处理和其它资源

通过`url-loader`来处理引入的图片，webpack5建议asset module（资源模块）来处理了，它会将图片文件转为base64格式，这样一来可以减少请求图片的次数，但是也有可能造成生成的base64比原来的图片大。

```shell
# 安装url-loader和file-loader
npm i url-loader file-loader -D
```
添加相关配置规则

```javascript
// webpack.config.js
module:{
  rules:[
    {
      test:/\.(jpg|png|jpeg|gif)$/,
      loader: 'url-loader',
      options:{
        // 小于10kb则会处理成base64格式
        limit: 10*1024
      }
    }
  ]
}
```

做好图片loader配置打包之后会发现，小于10k的图片已经打入到js中去了，大于10k的图片则保留在dist目录下。

> 这里需要注意的是，url-loader依赖于file-loader，所以必须安装两个loader才能处理图片打包

## webpack-dev-server

不管是htm、css还是js，都是改动比较频繁的文件，不可能说每次改完都要手动去打包看下效果，这样太麻烦了。可以引用`webpack-dev-server`来进行热加载，进行简单的配置更改之后会自动刷新。

```javascript
// webpack.config.js
devServer:{
  contentBase: Path.resolve(__dirname,'dist'),
  // 启动gzip压缩
  compress: true,
  port: 2333,
  open: true
}
```

> webpack 会将打包结果输出，
> npx webpack-dev-serve 只会在内存中编译打包，不会输出文件
> npx webpack-dev-server会报错Cannot find module 'webpack-cli/bin/config-yargs'
> 因为和webpack-cli版本不兼容，可以将webpack-cli回退到3版本
> 也可以执行npx webpack serve