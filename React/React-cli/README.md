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

## 配置代理

在package.json中或者setupProxy.js中配置代理信息

```json
// package.json
"proxy":"http://localhost:5000"
```
```javascript
// 新建一个setupProxy.js文件，react会自动读取
const proxy = require('http-proxy-middleware');
module.exports = function(app){
  app.use(
    proxy('/len',{
      target: 'http://localhost:5000',
      changeorigin: true,
      pathRewrite: {
        '^/len':'' // 重写请求路径，保证路径正确
      }
    })
    proxy('/len2',{
      target: 'http://localhost:5002',
      changeorigin: true,
      pathRewrite: {
        '^/len2':'' // 重写请求路径，保证路径正确
      }
    })
  )
}
```

## 发布订阅模式

兄弟组件之间的通信可以使用发布订阅模式，使用`pubsub-js`库可以实现父子组件之间的通信，而不是通过两组件的父组件

```javascript
// npm install pubsub-js -s 之后
// 发布消息
PubSub.publish('GETPRODUCTLIST', res.data);
// 订阅/接收消息
componentDidMount(){
  this.token = PubSub.subscribe('GETPRODUCTLIST', (msg,data) => {
    // msg 是消息名GETPRODUCTLIST
    console.log("订阅消息======",data)
  });
}
componentWillUnmount(){
  // 在组件卸载时解除订阅消息
  PubSub.unsubscribe(this.token);
}
```

## SPA

- 整个应用其实只有一个完整的页面
- 点击切换链接时不会刷新页面，只会做页面的局部更新
- 数据都是通过ajax请求获取

## react-router-dom

react有三种路由库可以使用，分别是`react-router`(通用型)、`react-native`(用于react-native)和`react-router-dom`(用于web)，这里使用`react-router-dom`来实现前端路由，直接安装和引用。

导航栏用Link标签，内容展示区则使用Route标签，同时需在最外层<App>包裹<BrowserRouter>或者<HashRouter>

```jsx
import { BrowserRouter as Router,Route, Switch,Link } from 'react-router-dom';
// 路由的跳转使用Link，会转换称a标签
<Link to="/home">Home</Link>
// 展示区域
<Route path="/home" component={Home}></Route>
// 或者
<Route path="/home"><Home/></Route>
// App外层包裹BrowserRouter
<BrowserRouter>
  <App/>
</BrowserRouter>
```

被路由匹配的组件称之为路由组件，路由组件会接收到三个props信息：`history`、`location`、`match`

```jsx
import {NavLink} from 'react-router-dom'
// 有个默认活动高亮的类名
<NavLink to="/home" activeClassName="active">Home</NavLink>
// 其中Home作为标签体内容，其实是通过props.children传递的
<NavLink to="/home" activeClassName="active" children="Home"/>
```

加`Switch`可以避免需要展示的路由多次匹配

```jsx
import { Route, Switch } from "react-router-dom";
<Switch>
  <Route path="/todo">
    <Todo />
  </Route>
  <Route path="/search">
    <Search />
  </Route>
</Switch>
```