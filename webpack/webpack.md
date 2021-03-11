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

做好图片loader配置打包之后会发现，小于10k的图片已经打入到js中去了，大于10k的图片则保留在dist目录下。但是还是会有问题，css引入背景图可能会引入打包路径的问题，导致没法展示图片。再者直接在html中引入图片也是不能直接展示，这就需要再加个`html-withimg-loader`来处理图片。

```javascript
// webpack.config.js
{
  test:/\.css$/,
  use:[
    {
      loader:MiniCssExtractPlugin.loader,
      options: {
        publicPath: '../',
      },
    },
    // 将css文件变成commonjs模块加载js中
    'css-loader',
  ],
},
{
  test:/\.less$/,
  use:[
    {
      loader:MiniCssExtractPlugin.loader,
      options: {
        publicPath: '../',
      },
    },
    'css-loader',
    'less-loader'
  ]
},
{
  // 处理html中直接引入的图片展示问题
  test: /\.(htm|html)$/,
  use: 'html-withimg-loader'
}
```

> 这里需要注意的是，url-loader依赖于file-loader，所以必须安装两个loader才能处理图片打包

## webpack-dev-server和HMR

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

模块热替换功能是webpack**开发环境**最终的功能之一，通过可以在css和js更新模块的时候不需要全部刷新打包而只刷新被更改过的模块。

> webpack 会将打包结果输出，
> npx webpack-dev-serve 只会在内存中编译打包，不会输出文件
> npx webpack-dev-server会报错Cannot find module 'webpack-cli/bin/config-yargs'
> 因为和webpack-cli版本不兼容，可以将webpack-cli回退到3版本
> 也可以执行npx webpack serve

## CSS兼容处理

有些css3的语言需要加前缀浏览器才能识别处理，所以需要对css做一个兼容性处理，主要是配置`postcss-loader`

```shell
npm i postcss-loader postcss-preset-env -D
```
在css-loader和less-loader下做如下配置
```javascript

// webpack.config.js
'css-loader',
{
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: [
        // postcss通过这个loader来找到package.json中的browserslist配置，看下哪些版本需要配置css兼容样式
        "postcss-preset-env",
      ],
    },
  }
}
```

## sourceMap

通过webpack会将几个js内容打包到一个js文件中，当发生错误时，很难定位到问题。通过sourceMap就可以定位到具体是哪个文件产生的问题。可以把sourceMap理解为源代码到构建后代码的映射，如果构建后代码报错，可以通过sourceMap追踪源代码错误。

直接在开发环境中配置`devtool`即可，也可以通过`source-map-loader`来配置控制sourceMap，devtool不同的值，生成不一样的sourceMap，如：

- eval-source-map：在初始化source map时比较慢，这里会使每个模块使用eval()执行，并且source map转换为DataUrl后添加到eval()中。
- source-map：整个source map会作为一个单独的文件生成。为bundle添加了一个引用注释，以便开发工具
- hidden-source-map：和source map类似，但是不会为bundle添加引用注释。如果只想source map映射那些源自错误报告的错误堆栈跟踪信息，但不想为浏览器开发工具暴露souremap
- inline-source-map: source map转换为DataUrl后添加到bundle中
- nosources-source-map：创建的不包含源代码内容，不会暴露原始代码

在开发环境中建议使用`eveal-source-map`(快速和调试兼顾)、`eval-cheap-source-map`和`eval-cheap-module-source-map`。
在生产环境中建议使用`source-map`、`hidden-source-map`和`nosources-source-map`


```javascript
devtool:'eveal-source-map'
```

## PWA

```javascript
// webpack.config.js
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
new WorkboxWebpackPlugin.GenerateSW({
  // serviceworker快速启动
  clientsClaim: true,
  skipWaiting: true 
})
```

## 多线程打包

通过`thread-loader`多线程打包方式，用于比较大、打包比较慢的工程打包，一般用于js编译。

```javascript
// webpack.config.js
use:[
  'thread-loader',
  {
    test: /\.js$/,
    loader: 'babel-loader',
    include: [resolve('src')]
  }
]
```

## externals

如果某些依赖有cdn地址，则可以考虑不用在本地打包，而是直接在html中以cdn的方式引入。
```javascript
// webpack.config.js
externals:{
  // 忽略打包的依赖名：npm包名
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex':'Vuex',
  'jquery': '$'
}
// index.js
import vue from 'vue'; // 可以不需要import了，可直接使用Vue
console.log(vue);
```

这样配置之后webpack在打包的时候是不会将vue和jquery打包进来的，但是别忘了要将vue和jquery以链接的方式引入。
```html
<script src="https://lib.baomitu.com/vue/2.6.12/vue.common.prod.js"></script>
```


## webpack.dll.js

在打包过程中，一般会有一个公共的js包，这个包含很多文件，如果能将指定的不常修改的库（如：vue、jqueyr、react）等进行单独打包，则可以减小公共包的大小。

首先必须要清楚的是，dll.js是为了单独打包某些库，这样就能避免再打包的重复打包某些依赖库，优化打包速度。这里通过manifest.json做了一个映射关系，然后通过DllReferencePlugin高速webpack在打包的时候不再打包映射到的依赖，最后通过AddAssetHtmlWebpackPlugin插件将webpack没打包但是一早就单独打包好的依赖插入到html中。

```javascript
// webpack.dll.js
const Path = require("path");
const webpack = require("webpack");
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
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
// webpack.config.js
plugins:[
  // ...
  new webpack.DllReferencePlugin({
    // 在打包的时候，mainfest.json文件中映射的js不会打包
    manifest: Path.resolve(__dirname,'dll/mainfest.json');
  })
  // 因为DllReferencePlugin插件告知了某些js是不需要打包的，不打包的话html引入了js就会报错，所以需要借助插件重新插入
  // 将某个文件打包输出，在html中插入
  new AddAssetHtmlWebpackPlugin({
    filepath: Path.resolve(__dirname,'dll/jquery.js')
  })
]
```

> [source-map](https://webpack.docschina.org/configuration/devtool/#root)
> [dll-plugin](https://webpack.docschina.org/plugins/dll-plugin/)