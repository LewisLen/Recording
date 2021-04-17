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

BrowserRouter和HashRouter的区别

- 底层原理不一样：BrowserRouter使用的是H5的history API，不兼容IE9及以下版本。HashRouter用的是URL的哈希值
- url表现形式不一样，HashRouter路径有#
- 刷新后对路由state参数的影响：BroswerRouter没有影响，因为state是保存在history对象中。HashRouter刷新后会导致路由state参数丢失。
- HashRouter可以用于解决一些路径错误相关的问题，兼容性更好

## 静态资源加载失败的问题

在public的html中新增静态资源如css本次链接可能因为路径原因加载失败，解放方法如下：

```jsx
// 更改引入路径，使用绝对路径
<link style="/style.css">
// 使用%PUBLIC_URL%路径(脚手架中的路径)
<link rel="apple-touch-icon" href="%PUBLIC_URL%/style.css" />
// 使用HashRouter
<HashRouter>
  <App />
</HashRouter>
```

## 路由重定向和嵌套路由

当所有path都不匹配时，则会走路由重定向。嵌套路由(/list/a)，不能在父级(/list)中加`exact`(精准匹配)，因为在匹配路由的时候，是先匹配父级(/list)，然后再匹配(/a)

```jsx
// 路由重定向
<Redirect to="/home">
// 嵌套路由
<Link to="/list/a"></Link>
// 注册路由
<Route path="/list/a" component={ListA}/>
```

路由params传递参数

```jsx
// 路由链接传参数
<Link to="/list/detail/01/a></Link>
// 声明接收参数
<Route path="/list/detail/:id/:title"></Route>
// 获取参数
this.props.match.params
```

通过search传递获取参数

```jsx
<Link to={`/list/detail/?id=${id}`}>
// 无需声明接收 正常的路由跳转即可
<Route path="/list/detail">
// 获取，通过querystring将urlencode形式转换为对象的形式
let {id} = qs.parse(this.props.location.search.slice(1))
```

通过路由state传递参数，这里的state和状态值是不一样的

```jsx
<Link to={{pathname:'/list/detail',state:{id:id}}}></Link>
// 无需声明接收 正常的路由跳转即可
let {id} = qs.parse(this.props.location.state)
```

> 三种方式刷新页面参数都不会丢失，因为这个state记录是保存在history中的，除非清除历史记录


## 路由的push和replace

路由默认的跳转方式是push模式，开启replace模式则不会留下痕迹

```jsx
<Link replace={true} to="/list/detail">
```

编程式导航

```jsx
// 通过事件传参的形式
replaceJump = (id) => {
  // params方式
  this.props.history.replace(`/list/detail/${id}`);
  // search-query方式
  this.props.history.replace(`/list/detail?id=${id}`);
  // state方式
  this.props.history.replace(`/list/detail`,{id});
}
pushJump = (id) => {
  this.props.history.push(`/list/detail/${id}`);
  this.props.history.push(`/list/detail?id=${id}`);
}
// 前进和后退
backJump = () => {
  // 后退
  this.props.history.goBack();
  // 前进
  this.props.history.goForward();
  // 指定跳转
  this.props.history.go(1)
}
```

## withRouter

直接调用的组件中是没有三个props信息：`history`、`location`、`match`的，为了能够使一般组件加上三个props信息，则需要借用`withRouter`函数，返回一个新组件。

```jsx
import {withRouter} from 'react-router-dom'
class Header extends React.Component{

}
export default withRouter(Header)
```

## redux

```shell
# 安装redux
npm install redux react-redux --save
```

redux 是独立于react的一个用于管理状态的库，react-redux 是react公司根据redux出的状态管理库。创建store后，用reducer函数来管理store，组件通过action来发起改变state，最终通过订阅state变化来重新渲染组件。reducer被第一次调用时，是store自动触发的，传递的previousState是undefined，action是@@REDUX/INIT

```javascript
// store.js
import { createStore } from 'redux';
import reducer from './reducer';
// 1. 创建store 2. 建立reducer(函数)来管理store
const store = createStore(reducer);
export default store;

// reducer.js
const initState = {
  // 初始化state
  count: 0
};

// reducer函数有两个参数，一个是previousState，一个是action{type,value}
export default (state = initState,action) => {
  const {type,value} = action;
  // 通过判断action的type来执行不同的指令
  if(type === 'INCREMENTVALUE'){
    let newState = JSON.parse(JSON.stringify(state))
    // 改变并返回state
    newState.count = state.count + value
    return newState
  }else if(type === 'DECREMENTVALUE'){
    let newState = JSON.parse(JSON.stringify(state))
    newState.count = state.count - value
    return newState
  }
  return state
}

// 组件内
// 接收到state的初始值
state = store.getState()
// dispath 发起action
increment = () => {
  const selectVal = parseInt(this.selectNumber.value);
  const action ={
    type:'INCREMENTVALUE',
    value: selectVal
  }
  store.dispatch(action)
}
// 组件挂载完成之后订阅state变化重新render
componentDidMount(){
  store.subscribe(() => {
    this.setState({})
  })
}
// 订阅state也可以放到最外层app组件，这样就能订阅所有的state变化，只要有state变化了，则更新对应的组件
// 入口文件index.js
import store from './store'
store.subscribe(() => {
  // ...
})
```

> reducer中不要修改state，可以深拷贝一份state，或者使用Object.assign()方法新建一个副本：Object.assign({},state,newState);
> 在default的情况下返回state，建议使用swith...case语句

## Redux-thunk(异步action)

redux中的action一般只接收object对象(type,value)，在需要异步改变state值时，需要使用异步action，这时就需要使用redux-thunk中间件了，它是对Redux中dispatch的加强。

```shell
# 安装redux-thunk
npm install redux-thunk --save
```

借助redux-thunk中间件来使用异步action

```javascript
// store.js
import { createStore,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(reducer,applyMiddleware(thunk));
export default store;

// action.js
// 异步action，通常action的值为函数，异步action中一般都会再调用同步action
export const createAsyncAction = (data,time) => {
  // 这里已经时在store中，所以是有dispatch方法
  return (dispatch) => {
    setTimeout(() => {
      // 也可以引入store并使用store.dispatch(incrementvalue(data))
      dispatch(incrementvalue(data))
    },time)
  }
}

// 组件内
store.dispatch(createAsyncAction(val));
```

## react-redux

遵循的原则：

1. 所有的UI组件都应该被一个容器组件包裹，父子组件关系
2. 容器组件是真正和redux打交道的，里边可以随意使用redux的api，通过props将store传递给容器组件
3. UI组件中不能使用任何的redux的api
4. 容器组件会传给UI组件：a. redux中所保存的状态 b. 用于操作状态的方法
5. 容器传给UI状态和方法，都是通过props传递的


这里会使用 react-redux 中的 connect 方法将分离的UI代码和业务代码链接起来，便于开发和维护。connect函数中的第一个参数的返回值会作为状态传递给UI组件，用key/value形式。第二个参数函数的返回值会作为操作状态的方法传递给UI组件。

```javascript
import { connect } from 'react-redux';
// 将state映射到Props中
const mapStateToProps = (state) => {
  const {count} = state
  return {
    count
  }
}
// 将dispatch映射到Props中
const mapDispatchToProps = (dispatch) => {
  return {
    increment: (val) => {
      // 执行redux的action
      dispatch(incrementvalue(val))
    },
    decrement: val => dispatch(decrementvalue(val)),
    incrementAsync: (val,time) => dispatch(createAsyncAction(val,time))
  }
}
// 简写，value必须是一个函数，react-redux会自动dispatch函数action
// const mapDispatchToProps = {
//   increment: incrementvalue,
//   decrement: decrementvalue,
//   incrementAsync: createAsyncAction
// }
connect(mapStateToProps,mapDispatchToProps)(CountUI)
```

> react-redux可以不用subscribe监测state变化，自身已经监测了

## Redux Dev Tools

使用`Redux Dev Tools`来调试redux是非常方便的

```javascript
import { applyMiddleware, compose, createStore } from 'redux';
// 用thunk中间件来使用异步action
import thunk from 'redux-thunk';
import reducer from './reducer';

/*
常规reducer管理store
const store = createStore(reducer);

使用Redux Dev Tools
const store = createStore(reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
*/

// 可以使用reducer、异步aciton和Redux Dev Tools
const composeRedux = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}):compose;

const store = createStore(reducer,composeRedux(applyMiddleware(thunk)));
export default store;
```

## Provider

`<Provider>`是一个提供器，使用了 Provider 组件，组件里边的其它所有组件都可以使用store了

```jsx
import { Provider } from 'react-redux';
import store from './store';
  <Provider store={store}>
    <React.StrictMode>  
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  </Provider>
```

## combineReducers

管理多个reducer，使用redux中的combineReducers方法

```javascript
// store.js
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import BookReducer from './reducers/book';
import CountReducer from './reducers/count';

const allReducers = combineReducers({
  CountReducer,
  BookReducer
})
const composeRedux = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}):compose;
const store = createStore(allReducers,composeRedux(applyMiddleware(thunk)));
export default store;

// count.jsx
const mapStateToProps = (state) => {
  const {CountReducer,BookReducer} = state.CountReducer;
  return {
    count: CountReducer,
    books: BookReducer
  }
}
```

则在组件之内就可以共享state数据了


## setState()

setState是更新状态的方法，有两种写法：

1. 对象式写法：setState(stateChange,[callback])，改变state状态值其实是异步的，callback为可选回调函数，在状态更新完、界面也更新完（render调用后）才会被调用
2. 函数式：setState(updater,[callback])。updater为返回stateChange对象的函数，updater可以接收到state和props。callback为可选回调函数，在状态更新完、界面也更新完（render调用后）才会被调用

```javascript
// 对象世
this.setState({},() => {
  console.log(this.state);
})
// 函数式
this.setState((state,props) => {
  // 可以拿到state和props
  return {count: state.count + 1}
})
```

## lazy和Suspense

懒加载方式，使用react中的lazy方式。必须给Suspense的fallback函数指定加载中的组件

```javascript
import React, { Component, lazy, Suspense } from 'react';
// 懒加载
const Count = lazy(() => import('../contains/Count/Count'));
export default class Content extends Component {
  render() {
    return (
      <div>
        内容区域
        <Suspense fallback={<h1>Loading...</h1>}>
          <Route path="/count">
            <Count/>
          </Route>
        </Suspense>
      </div>
    )
  }
}
```

## state Hook

React.useState()可以让函数式组件也拥有state状态值

```javascript
import React from 'react';
function HooksCount(){
  // useState参数会在第一次初始化的时候将指定值在内部做缓存处理
  const [count,setCount] = React.useState(0);
  const [name,setName] = React.useState('len');
  // 返回值为[内部当前的状态值，更新状态值的函数]
  const addCount = () => {
    setCount(count + 1); // 第一种写法
    setCount(count => count + 1) // 第二种写法
    setName(name => 'LewisLen') // 第二种写法
  }
  return (
    <div>
      <h2>Count: {count}</h2>
      <h2>name: {name}</h2>
      <button onClick={addCount}>加</button>
    </div>
  )
}
export default HooksCount;
```



