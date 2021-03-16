# React

## Hello React

React不直接操作DOM，而是操作虚拟DOM，通过比对来渲染视图。虚拟DOM本质是Object类型的对象，相对于真实DOM，虚拟DOM属性少很多，只用于React内部使用，最终会转化成真实DOM。

React 应用一般只有单一的根DOM节点，渲染到DOM节点中，使用`ReactDOM.render()`方法将元素渲染到DOM根节点中

```html
<!-- 需注意顺序 -->
<!-- react核心裤 -->
<script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
<!-- react操作dom -->
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
<!-- 编译jsx -->
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
<div id="app"></div>
```
```javascript
// 注意type类型，为jsx语法
<script type="text/babel">
  const Vdom = <h1>Hello React,I am Len</h1>;
  ReactDOM.render(
    Vdom,
    document.getElementById("app")
  )
</script>
```

jsx语法规则：

- 定义虚拟DOM时，不要写引号
- 标签中混入JS表达式时要用{}
- 样式的类名用className(小驼峰)
- 内联样式，用{key:value}的形式
- 只有一个根标签，且标签必须闭合
- 标签首字母，小写字母开头则会渲染成标签，大写则渲染成组件

> Babel会把jsx转译成一个`React.createElement()`函数调用，并且会预先执行一些检查，实际上创建了js对象
> Virtual DOM的思想是将实际DOM节点抽象为内存中的JavaScript对象

## 组件

组件必须以大写字母开头，小写字母会被认为是html标签。函数组件和类式组件，关于类式组件

```javascript
// 函数式声明组件
function ComponentA(){
  return <div>'组件A'</div>
}
// 类式组件
class ComponentB extends React.Component{
  // render是在ComponentB的原型对象上
  render(){
    console.log(this);// 这里的this指向的是ComponentB的实例对象
    return <div>'组件B'</div>
  }
}
ReactDOM.render(
  // <ComponentA/>,
  <ComponentB/>,// 在React里边做了new实例操作
  document.getElementById("app")
)
```

> 类式组件：React在找到componet组件之后，new 一个实例出来，并通过该实例调用到组件(B)原型上的render方法

## Props

props是只读的，组件没法修改自身的props。

```javascript
class Welcome extends React.Component{
  render(){
    // 通过this可以获取props，这里的this指向的是Welcome的实例对象
    return <h1>Hello,{this.props.name}</h1>
  }
}
ReactDOM.render(
  <Welcome name="Len"/>,// 在React内部做了new实例的操作
  document.getElementById('app')
)
```

## State

state是私有的，受控于当前组件。不要直接修改state，而是需要通过`setState()`来给state赋值，构造函数是唯一可以给this.state赋值的地方。

```javascript
// 错误做法
this.state.name = 'lai';
// 正确做法
this.setState({
  name: 'len'
});
```

## 事件处理

React的事件命名采用小驼峰命名，使用jsx语法只需要传入一个函数作为事件处理函数。

## 条件渲染和列表渲染

一般都是是用元素的ID作为key值，万不得已时可以使用元素索引index来作为key值，可以简单理解为只要需要map方法的元素就需要设置key属性，且必须是唯一值。


