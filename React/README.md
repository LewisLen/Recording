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

## State

state是私有的，受控于当前组件。不要直接修改state，而是需要通过`setState()`来给state赋（合并原有state），构造函数是唯一可以给this.state赋值的地方。

```javascript
// js
class Phone extends React.Component{
  constructor(props){
    super(props)
    // 解决this指向问题
    this.checkTypeFn = this.checkType.bind(this);
    // 对于赋值语句，要从右边开始看，起初this(实例对象)上是没有checkType这个方法的，会从原型（Phone原型）上找到方法。执行完this.checkType.bind(this)之后，会生成一个新的函数，并且函数里的this是指向实例对象（通过bind传入）的，再将这个方法赋值给实例对象的checkTypeFn
    this.state = {
      IOS: true
    }
  }
  render(){
    // 这里如果是直接调用this.checkType，则并不是通过Phone的实例对象调用checkType方法的，而是直接调用，直接调用因为自定义方法里开启了严格模式，所以this会指向undefined。
    // console.log(this)
    console.log(this)
    // return <h2 onClick={this.checkType}>这一是款{this.state.IOS?'苹果':'安卓'}手机</h2>
    return <h2 onClick={this.checkTypeFn}>这一是款{this.state.IOS?'苹果':'安卓'}手机</h2>
    // 功过bind之后，这里调用的其实是实例自身的checkType方法
  }
  checkType(){
    // 这里的方法是放在原型对象上，也就是Phone的原型对象上，供实例对象使用
    // 这里开了自动开启了严格模式
    // 这里的this是undefined
    console.log(this)
    // 错误赋值做法
    // this.state.IOS = !this.state.IOS;
    this.setState({
      IOS: !this.state.IOS
    })
  }
}
ReactDOM.render(
  <Phone/>,
  document.getElementById("app")
)
```

this 指向问题

```javascript
// 定义普通的类
class Phone{
  constructor(type,prices){
    this.type = type;
    this.prices = prices;
  }
  ringUp(){
    console.log(this)
  }
}
const huawei = new Phone('华为','3999');
huawei.ringUp();// Phone实例对象
const tempPhone = huawei.ringUp;
tempPhone();// undefined
function fn(){
  console.log(this) 
}
fn()// window
function fn2(){
  'use strict';
  console.log(this)
}
fn2()// undefined
```

必须注意的是，`constructor`和`render`中，`this`指向的都是类的实例对象，但是在继承类的自定义方法中， `this`指向的原本是`window`，但由于在方法中自动开启了js的严格模式，所以this是`undefined`。解决this指向问题可以通过绑定this或者使用赋值语句箭头函数。箭头函数是放在实例自身上的方法。

> setState()方法是在React.Component的原型对象上

## Props

ES6中的static关键字表示该属性或者方法不会被实例继承，而是类直接调用的属性，利用static关键字给类式组件添加props，props属性是只读的。

constructor 构造器属性在React中一般用于两种情况：

1. 通过this.state赋值对象初始化内部state
2. 为事件处理函数绑定实例
3. 获取实例props

所以可以通过构造函数spuer在构造函数中获取`this.props`，但是

```javascript
class Books extends React.Component{
  // constructor构造函数可写可不写
  constructor(props){
    super(props);
    console.log(this.props);// 能够获取到props
    // 如果没有使用super接收props，则没法获取实例props
  }
  static propTypes = {
    title: PropTypes.string.isRequired, // 限制类型和是否必传
    price: PropTypes.number,
    author: PropTypes.string
  }
  static defaultProps = {
    price: 99 // 设置props默认值
  }
  render(){
    const {title,price,author} = this.props;
    return (
      <ul>
        <li>书名：{title}</li>
        <li>作者: {author}</li>
        <li>价格：{price}</li>
      </ul>
    )
  }
}
// 相当于static写法
Books.propTypes = {
  title: PropTypes.string.isRequired, // 限制类型和是否必传
  price: PropTypes.number,
  author: PropTypes.string
}
Books.defaultProps = {
  price: 99 // 设置props默认值
}

ReactDOM.render(
  <Books title="红楼梦" author="曹雪芹" />,
  document.getElementById('app')
)
```

除了类式组件，还可以通过函数式组件获取props

```javascript
function Books(props){
  // 通过props参数也能够获取到props
  const {title,price,author} = this.props;
  return (
    <ul>
      <li>书名：{title}</li>
      <li>作者: {author}</li>
      <li>价格：{price}</li>
    </ul>
  )
}
// 和定义Books属性也是一样的
Books.propTypes = {};
Book.defaultProps = {};

ReactDOM.render(
  <Books title="红楼梦" author="曹雪芹" />,
  document.getElementById('app')
)
```

## ref

React 支持一个特殊的、可以附加到任何组件上的 ref 属性，此属性可以是一个由 React.createRef() 函数创建的对象、或者一个回调函数、或者一个字符串（遗留 API）。当 ref 属性是一个回调函数时，此函数会（根据元素的类型）接收底层 DOM 元素或 class 实例作为其参数，慎用ref属性

```javascript
class TodoList extends React.Component{
  // 调用后可以返回一个容器，存储ref所标示的节点
  tempRef = React.createRef();
  showInfo = () => {
    const {li} = this;
    console.log(li)
  }
  showDomInfo = (ref) => {
    console.log(ref)
  }
  showTempRef = () => {
    console.log(this.tempRef.current);// ref节点
  }
  render(){
    console.log(this);
    return (
      <ul>
        <li ref="studyLi">学习React</li>
        <li ref={(li) => {this.li2 = li}}>使用React</li>
        <li ref={this.showDomInfo}>使用React</li>
        <li ref={this.tempRef}>巩固React</li>
      </ul>
    )
  }
}
ReactDOM.render(
  <TodoList/>,
  document.getElementById('app')
)
```

如果 ref 回调函数是以内联函数的方式定义的，在更新过程中它会被执行两次，第一次传入参数 null，然后第二次会传入参数 DOM 元素。

## 事件处理

React的事件命名采用小驼峰命名，使用jsx语法只需要传入一个函数作为事件处理函数。需要注意的是，React的事件处理如`onClick`并不是原生DOM事件，而是React自定义事件，是通过事件委托的方式（委托给最外层元素）来处理的，可以通过`event.target`得到发生的DOM元素对象。

```javascript
class Welcome extends React.Component{
  constructor(){
    super()
    this.state = {
      userName: '',
      passWord: ''
    }
  }
  showInfo = (inputType) => {
    return (event) => {
      this.setState({
        [inputType]: event.target.value
      })
      console.log(inputType,event.target.value)
    }
  }
  render(){
    // 通过this可以获取props，这里的this指向的是Welcome的实例对象
    return (
      <div>
        用户名：<input type="text" onChange={this.showInfo('userName')} />
        密码： <input type="password" onChange={this.showInfo('passWord')} />
        <button>登录</button>
      </div>
    )
  }
}
```

> 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。必须保证传给事件处理的是一个函数(方法)
> 高阶函数：若函数fn接收的参数是一个函数，那么fn可以称之为高阶函数。或者若fn函数，调用的返回值依然是一个函数，那么fn可以称之为高阶函数。如Promise、setTimeout、Array.map
> 函数柯里化：把接受多个参数的函数变成接受一个单一函数的函数，并且返回接收余下的参数而且返回结果的新函数的技术。
> 受控组件：输入类的值维护到状态state中，需要用到时从状态tate中取(不用写那么多ref)
> 非受控组件：输入类组件的值现用现取(需要一对一的ref)

## 生命周期

挂载时生命周期钩子函数执行顺序：constructor、componentWillMount、render、componentDidMount、componentWillUnmount
组件更新时：shouldComponentUpdata(强制更新无这一步)、componentWillUpdata、render、componentDidUpdate、componentWillUnmount

父组件改变state时：
- (父组件)shouldComponentUpdata
- (父组件)componentWillUpdata
- (父组件)render
- (子组件)componentWillReceiveProps
- (子组件)shouldComponentUpdata
- (子组件)componentWillUpdate
- (子组件)componentDidUpdate
- (父组件)componentDidUpdate


常用组件：

- componentDidMount: 常用于初始化，如开启定时器、发网络请求、订阅消息
- componentWillUnmount: 关闭定时器、取消订阅消息

```javascript
class Welcome extends React.Component{
  constructor(props){
    console.log('Welcome--constructor');
    // this指向实例对象
    super(props);
    this.state = {
      count: 1
    }
  }
  addCount = () => {
    this.setState({
      count: this.state.count+1
    })
  }
  tempUnmount = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('app'));
  }
  // 强制更新
  forceChangeData = () => {
    this.forceUpdate();
  }
  // 组件将要挂载
  componentWillMount(){
    console.log('Welcome--componentWillMount');
  }
  // 组件已挂载
  componentDidMount(){
    // this指向实例对象
    console.log('Welcome--componentDidMount');
  }
  // 组件将要卸载
  componentWillUnmount(){
    console.log('Welcome--componentWillUnmount');
  }
  // 告知组件是否要更新，默认返回true（forceUpdate强制更新不会调用这个钩子函数）
  shouldComponentUpdate(){
    console.log('Welcome--shouldComponentUpdate');
    return true;
  }
  // 组件将要更新
  componentWillUpdate(){
    console.log('Welcome--componentWillUpdate');
  }
  // 组件已经更新
  componentDidUpdate(){
    console.log('Welcome--componentDidUpdate');
  }
  render(){
    console.log('Welcome--render');
    // this指向实例对象
    const {count} = this.state;
    return (
      <div>
        <h1>Hello,{this.props.name}</h1>
        <p>{count}</p>
        <button onClick={this.addCount}>加+++</button>
        <button onClick={this.tempUnmount}>卸载组件</button>
        <button onClick={this.forceChangeData}>不改变数据，强制更新</button>
        <A count={count}/>
      </div>
    )
  }
} 
class A extends React.Component{
  constructor(props){
    super(props)
  }
  // 子组件将要接收新的props
  componentWillReceiveProps(props){
    console.log('A--componentWillReceiveProps',props);
  }
  // 告知组件是否要更新，默认返回true（forceUpdate强制更新不会调用这个钩子函数）
  shouldComponentUpdate(){
    console.log('A--shouldComponentUpdate');
    return true;
  }
  // 组件将要更新
  componentWillUpdate(){
    console.log('A--componentWillUpdate');
  }
  // 组件已经更新
  componentDidUpdate(){
    console.log('A--componentDidUpdate');
  }
  render(){
    return <h2>{this.props.count}</h2>
  }
}
ReactDOM.render(
  <Welcome name="Len"/>,
  document.getElementById('app')
)
```

## 条件渲染和列表渲染

一般都是是用元素的ID作为key值，万不得已时可以使用元素索引index来作为key值，可以简单理解为只要需要map方法的元素就需要设置key属性，且必须是唯一值。


