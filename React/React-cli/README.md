## React脚手架

需提前安装node和npm

```shell
# npm5.2后自带npx
npx create-react-app react-demo
# 或者
npm i create-react-app -g # 全局安装react脚手架
create-react-app react-demo # 初始化项目
# 安装依赖启动项目
cd react-demo
npm install
# 在本地启动项目
npm run start
# 暴露所有webpack配置且不能回退
npm run eject
```

脚手架主要生成的文件

- App.css App组件的css文件
- App.js App组件
- App.test.js 专门用来给APP做测试的，几乎不用
- index.css 通用型css
- index.js  入口文件
- reportWebvitals.js  用于记录页面的性能web-vitals库的支持
- setupTests.js 用于组件单元测试jest-dom库的支持

## 创建组件

组件用jsx语法

```javascript
// App.js
import React,{Component} from 'react'
// 注意这里的{component}并不是解构赋值引入，而是在react里边分别暴露了一个Component类
// 而React则是默认暴露
const {Component} = React;// 这里是解构赋值
// react.js
const React = {props,state};
// 分别暴露了一个Component类
export class Component{}
React.Component = Component
// 默认暴露
export default React;
```

## 样式模块化

```javascript
// 将css文件名改为**.module.css
// 引入方式改变
import test from './index.module.css';
// 使用模块样式名
{
  return <div className={test.title}></div>
}
```