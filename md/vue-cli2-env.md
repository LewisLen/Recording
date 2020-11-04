# vue-cli2多环境打包配置

一般来说，利用 vue-cli2 开发项目的使用，只会用到本地环境和生成环境，但有些公司生成环境也有很多套，比如 dev 环境、 fat 环境、 uat 环境、 prod 环境，这对于前端来说，如果每次切换环境我们都用更改调用接口的跟路径，然后再手动编译打包，那显然有些繁琐。本文就是记录通过打包命令的不同，引用不同的请求更路径，编译打包之后自动更改对应的环境。

## 安装 cross-env 依赖

cross-env 是为了解决 window 平台下多环境阻塞问题

```bash
npm i cross-env -D
```

## package.json

```json
"scripts":{
  "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
  "build:dev": "cross-env NODE_ENV=production ENV_CONFIG=dev node build/build.js",
  "build:fat": "cross-env NODE_ENV=production ENV_CONFIG=fat node build/build.js",
  "build:uat": "cross-env NODE_ENV=production ENV_CONFIG=uat node build/build.js",
  "build:prod": "cross-env NODE_ENV=production ENV_CONFIG=prod node build/build.js"
}
```

修改了 package.json 文件中的 scripts ，那么我们就能运用不同的命令进行编译打包，甚至我们也可以给 dev 配置不同的环境变量

```bash
npm run build:dev
npm run build:fat
npm run build:uat
npm run build:prod
```

这样多种命令都能执行了，并且对应不同的 NODE_ENV 和 ENV_CONFIG 变量

## 创建对应的文件

新建三个不同的文件，分别为： dev.env.js、fat.env.js、uat.env.js 和 devLocal.env.js

```javascript
// devLocal.env.js
var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv,{
  NODE_ENV: '"development"', // 环境变量
  ENV_CONFIG: '"devLocal"', // 
  BASE_URL: '"https://127.0.0.1/"' // 本地联调环境
})

// dev.env.js
module.exports = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"dev"',
  BASE_URL: '"http://www.dev.com/"' // dev环境
}

// fat.env.js
module.exports = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"fat"',
  BASE_URL: '"http://www.fat.com/"' // fat环境
}

// uat.env.js
module.exports = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"uat"',
  BASE_URL: '"http://www.uat.com/"' // uat环境
}

// prod.env.js
module.exports = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"prod"',
  BASE_URL: '"http://www.prod.com/"' // uat环境
}
```

## build/

```javascript
// build.js
process.env.NODE_ENV = 'production'; // 注释
// webpack.prod.conf.js
new webpack.DefinePlugin({
  'process.env': env
})
```

## config/

```javascript
// config/index.js
build:{
  env: process.env.ENV_CONFIG ? require('./'+process.env.ENV_CONFIG+'.env') : require('./prod.env');
},
env:{
  env: require('./devLocal.env);
}
```

## BASE_URL

```javascript
const ENV_CONFIG = process.env.ENV_CONFIG;
const BASE_URL = process.env.BASE_URL;
const isPro = process.env.NODE_ENV === 'production';

const devUrl = BASE_URL || 'http://www.dev.com/';
const fatUrl = BASE_URL || 'http://www.fat.com/';
const uatUrl = BASE_URL || 'http://www.uat.com/';
const prodUrl = BASE_URL || 'http://www.prod.com/';


var tempContext = '';

switch(ENV_CONFIG){
  case 'dev':
    context = devUrl;
  case 'fat':
    context = fatUrl;
  case 'uat':
    context = uatUrl;
  case 'prod' = prdUrl      
}

export const context = tempContext;
```