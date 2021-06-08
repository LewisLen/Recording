## 探索Vue2.x响应式原理

相对于react和微信小程序对于属性的**侵入式**更改，Vue属于**非侵入式**

> vue 是直接更改数据即可影响视图变化，如：this.num = 100
> React 和 小程序则需要调用指定的封装方法来改变数据再改变视图
> React: this.setState({num:10})
> 小程序: setData({num: 10})

相信很多用过 Vue 的小伙伴都了解过其响应式原理的核心式`Object.defineProperty`吧，但是大部分也只是知道用了这个知识点，并不了解响应式原理的真正过程。

### 关于Object.defineProperty方法

Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此**对象**。其关键属性`get`和`set`能够监测和设置对象指定属性，换句话说，只要对象有了`getter`和`setter`，那么就可以认为这个对象是**响应式对象**，所以想要达到响应式的目的，那么就需要将所有对象的属性通过该方法来定义劫持。

```javascript
var book = {
  title: 'js',
  type: 'web'
}
Object.defineProperty(book,'price',{
  // 表示该对象的属性是否可以被delete删除，以及除 value 和 writable 特性外的其他特性是否可以被修改。默认为false
  configurable: false,
  // 是否只读，默认是false(只读)。为true时，才能通过该方法改变对象属性的值
  writable: false,
  // 是否可以被枚举，默认是false(不可枚举)。只有为true时，才能被for...in等循环方法遍历出来
  enumerable: false,
  // 属性值
  value: '100'
})
// 因为price属性被设置为false只读不可修改，所以这里的赋值是无效的
book.price = '98';
console.log(book.price); // 100
// price属性不可枚举
for(var k in book){
  console.log(k) // title、type
}
// configurable为false，没法删除该方法定义的属性
delete book.price;
// 但是可以直接删除字面量初始化已有的属性
delete book.title;
console.log(book);// {type: "web", price: "100"}
Object.defineProperty(book,'price',{
  // configurable为false，属性不可被更改，报错
  enumerable: true,
  value: '1000'
})

var obj = {};
// 只要使用Object.defineProperty方法定义新属性后，这个属性的特性中configurable，enumerable，writable都为默认的值false
// 这就导致了被定义的属性是不能重写、不能枚举、不能再次设置特性
Object.defineProperty(obj,'asd',{
  // 不设置属性，则默认为false
});
obj.asd = 'hello';
console.log(obj.asd); // undefined 不可赋值
for( var k in obj ){
    console.log(k); // undefined 不可枚举
}
```

也就是说 Object.defineProperty 方法可以新增和修改对象的属性，相对于直接对属性的赋值，该方法还有其它的设置。响应式涉及到主要还是`get`和`set`属性，属性对应有`getter`和`setter`方法

```javascript
let person = {}
let tempValue;
Object.defineProperty(person,'name',{
  // getter函数
  get(){
    // 当读取name属性时调用
    console.log('getter函数被调用====')
    // 如果没有return值则默认为undefined
    return tempValue;
  },
  // setter函数
  set(newValue){
    // 当设置name属性时调用，能够通过newValue拿到要被设置的值
    // 但是此时还是没法直接更改属性的值，因为属性值都是从getter函数获取的，所以这里用了一个全局的中间变量来连接getter和setter
    console.log('setter被调用====',newValue)// “LewisLen”
    tempValue = newValue
  }
})
person.name = "LewisLen"
console.log(person.name)// LewisLen
```

> 总结：利用 Object.defineProperty() 方法中的 getter 和 setter 来定义对象属性的行为，就可以称之为**数据劫持**，即可认为被定义的对象是**响应式对象**。


### defineReactive（响应式函数）

从上面的代码中看出，直接更改 person 的 name 属性值，根本没有生效，但是能得到 newValue ，因为属性值都是从 getter 函数中的 return 值得到的，所以需要借助一个全局变量来连接 getter 和 setter ，这里利用里闭包的特性，使得每个属性都有一个 val 中间值。

```javascript
let person = {}
// 相当于在最外层加个中间的变量val，和getter/setter形成一个闭包
function defineReactive(data,key,val = data[key]){
  // 设置默认值，为所传的对象属性值
  // val = data[key] 等价代码
  // if(arguments.length === 2){
  //   val = data[key]
  // }
  Object.defineProperty(data,key,{
    enumerable: true,
    configurable: true,
    get(){
      return val
    },
    set(newValue){
      // 如果新值和原来的值没变化，则不赋值
      if(val === newValue) return;
      val = newValue
    }
  })
}
defineReactive(person,'name',"Len");
person.name = "LewisLen"
console.log(person)// "LewisLen"
```

### Observer类

需将要劫持的数据对象多个属性进行遍历，也就是说有多少个对象就有多少个 Observer 实例，每个对象的属性都会被 defineReactive

```javascript
class Observer{
  constructor(obj){
    this.walk(obj)
  }
  // 遍历每个对象的属性
  walk (obj) {
    // data属性组成的数组
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      // 给data属性对象添加getter和setter方法
      defineReactive(obj, keys[i])
    }
  }
}
```

但这里有个问题，Observer 类只能遍历传入的 data 第一层属性，然后 defineReactive 将其响应式，如果遇到多层（嵌套）对象，则没法将深层次的对象劫持，需要通过递归来完成深层次的遍历。

```javascript
// 观察方法（入口方法）
function observe(obj){
  // 必须保证要观察的data是对象，才能够用被 defineReactive
  if(typeof obj !== 'object' || obj === null) return;
  new Observer(obj);
}
class Observer{
  constructor(obj){
    this.walk(obj)
  }
  // 遍历每个对象的属性
  walk (obj) {
    // data属性组成的数组
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      // 给data属性对象添加getter和setter方法
      defineReactive(obj, keys[i])
    }
  }
}
function defineReactive(data,key,val = data[key]){
  // val设置默认值，为所传的对象属性值，同时也是连接 getter 和 setter 函数的作用
  // 这里需要需要看data的属性值是否是对象
  // 如果val是对象，则需要再走一遍observe，以便给每个对象defineReactive
  // 如果val不是对象，则observe直接return;，只给当前属性(对象)defineReactive
  observe(val); // 递归处理
  Object.defineProperty(data,key,{
    enumerable: true,
    configurable: true,
    get(){
      return val
    },
    set(newValue){
      // 当对某个属性赋值时也有可能是对象，所以也需要 observe
      observe(val);
      if(val === newValue) return;
      val = newValue
    }
  })
}
```

通过代码可以得知，通过入口 observe -> 创建 Observer 实例 -> defineReactive劫持 实现对每个对象的属性递归处理，在每个(层级)属性上添加了 getter 和 setter 函数，也就是实现实现响应式，进行劫持。

Vue源码中劫持的操作后，会把数据对象转换为：

```javascript
const data = {
  a: {
    b: 1
  }
}
// 转换为
const data = {
  a: {
    b: 1,
    __ob__: {value, dep, vmCount}
  },
  __ob__: {value, dep, vmCount}
}
// __ob__ 属性其实就是 Observer 类的实例，vue源码中通过判断数据对象属性中是否有 __ob__ 属性决定是否还要 defineReactive 进行劫持
```

### Watcher类和Dep

可能存在多个组件依赖数据的情况，数据的变化需要通知到组件去做成对应的更新。这时就需要用到收集依赖(数据)的变化，在变化之后，通知依赖去更新。

- 依赖：用到数据的地方(如组件)，watcher 依赖。也可以理解为数据
- Watcher类：对于 Watcher 类，这是一个比较抽象的概念，应该是一个数据变化从而要发生变化（触发回调方法如派发更新）的这么一个对象。Watcher 实例会根据数据的变化来触发某些事件，通知视图更新，就是用来观察数据变化的。也可以看成是数据对象和组件之间的中介。每个 Watcher 实例订阅一个或者多个数据，这些数据也被称为 watcher 的依赖(商品就是买家的依赖)
- Dep类：用来管理 Watcher 实例

比如在双十一搞活动，有预售商品A售卖，那么在预售阶段，买家张三李四等就会去点击预购下定金，taobao 后台系统就会在商品A对应的管理系统将买家信息收集起来，这时买家就处于等待阶段，等到商品A开售，taobao 系统就会提醒买家支付尾款下单购买，购买之后，taobao商品的状态应该是等待发货，这就完成了发布-订阅模式的流程。
这个例子当中，商品A就是依赖（data）的各类状态（data属性），买家张三李四就是 Watcher 的实例，买家在商品上架之后就可以点击预购，这时候 taobao 系统就是 Dep 来管理 Watcher 的一系列动作，收集买家的预售信息就是收集依赖，通知付尾款就是派发通知，买家的一些类动作之后，会引起商品信息（页面）的变化。

主要是研究渲染函数中的 Watcher，先建立一个管理 Watcher 实例的类 Dep

```javascript
// Dep类来管理 watcher
class Dep{
  constructor(){
    // 存放 watcher
    this.subs = []
  }
  // 收集依赖，说白了就是收集数据的变化
  depend(){
    this.addSubs(Dep.target)
  }
  // 派发通知更新，当依赖(数据)变化之后通知去更新视图
  notify(){
    const subs = [...this.subs];
    // 通知每个wathcer作出对应的动作
    subs.forEach( sub => {
      sub.update();
    })
  }
  addSubs(sub){
    this.subs.push(sub)
  }
}
// Dep类上的静态属性，不是实例上的属性，所以是全局唯一的target属性，保证了同一时间只能有一个全局的 Watcher 被计算，这里写成 window.watcherTarget也是一样的
Dep.target = null
```

再来定义一个 Watcher 类，用来观察 data 数据对象的变化

```javascript
// Watcher类
class Watcher{
  // 变量命名原则：内部数据使用下划线开头，只读数据用$开头
  constructor(data,objPath,callback){
    // 保存的传入的对象
    this._data = data;
    this._objPath = objPath;// 观察的表达式(属性路径)，如obj.a.b
    this._callback = callback;// 观察的表达式变化时触发的回调函数
    this._value = this.get();// 得到指定路径的value值
  }
  get(){
    return getValueByObjPath(this._objPath)(this._data);
  }
  update(){
    this._value = getValueByObjPath(this._objPath)(this._data);
    // 当数据变化 执行回调函数 更新视图
    this._callback();
  }
}

function getValueByObjPath(path){
  // 为了获取数据中多层对象的值 如obj.a.b
  let paths = path.split('.');
  // 函数柯里化
  return function(data){
    let res = data;
    let prop;
    while(prop = paths.shift()){
      res = res[prop]
    }
    return res;
  }
}
```

定义了 Watcher 类，那什么时候实例化呢？从`src/core/instance/init.js`中的`_int`方法可以得知，`$mount`方法是将组件挂载到给定元素上的函数。而`$mount`又是通过`mountComponent`函数去真正的挂载组件。在 `mountComponent`方法中执行完`beforeMount`之后，定义了`updateComponent`函数，这个函数是传入`Watcher`类的第二个参数，作用就是：把渲染函数生成的虚拟DOM渲染成真正的DOM，之后 new Watcher()。

也就是说 initData -> initLifecycle 中，在挂载 DOM 过程中调用了 mountComponet 方法生成真实 DOM 前（beforeMount后，Mounted前）在当前组件 vm 中实例化了 Watcher。

```javascript
// vue源码片段 lifecycle.js文件
// 初始化生命周期的时候 有声明vm._watcher
vm._watcher = null
// ...
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
// new 了一个 watcher 实例
new Watcher(vm,updateComponent)
```

- vm._render 函数的作用是调用 vm.$options.render 函数并返回生成**虚拟节点(vnode)**
- vm._update 函数的作用是把 vm._render 函数生成的虚拟节点渲染称真正的 DOM


所以一旦 vm 实例中的 data 对象值发生变化，那么就会触发 watcher 对象， watcher 对象就会调用 updateComponent 方法重新绘制 DOM 节点。

那就需要收集看 vm 中用到了哪些数据对象，也就是需要收集数据依赖和根据依赖的变化去通知 watcher 作出回应从而更新视图了。这里还得注意到实例化 watcher 的过程，实例化执行到 constructor 的时候，会调用 Watcher 类上的 get 方法（求属性值的方法），那就会触发该属性上的 getter 函数。所以可以将收集依赖(depend watcher)放在 getter 函数上，属性中的 getter 函数执行完毕，则收集该属性也就结束了，实例中的 get 方法才执行完，最后 constructor 执行完。

```javascript
function defineReactive(data,key,val = data[key]){
  // 每个属性都有一个Dep实例来管理 watcher
  const dep = new Dep();
  let childOb = observe(val);// 最后返回的ob当中也有dep实例，是为了在 vue.set 方法触发时派发 watcher 去更新视图
  Object.defineProperty(data,key,{
    enumerable: true,
    configurable: true,
    get(){
      // 在get中收集依赖
      dep.depend('watcher实例')
      return val
    },
    set(newValue){
      // 当对某个属性赋值时也有看你是对象，所以也需要observe
      observe(val);
      if(val === newValue) return;
      val = newValue;
      // 派发更新依赖
      dep.notify();
      console.log('更新视图')
    }
  })
}
```

在获取属性的时候收集依赖，在设置属性的时候触发之前收集的依赖。这时，新问题出现了， depend 的 watcher 实例从哪里来？将 watcher 放到全局即可解决。

```javascript
// 更改 Watcher 类的 get 方法
get(){
  // 设置 watcher 实例对象为全局属性 watcherTarget，vue源码中用的是Dep.target
  window.watcherTarget = this;
  const value = getValueByObjPath(this._objPath)(this._data);
  window.watcherTarget = null;
  return value;
}
```

这里会有个问题，当对象obj:{a:'a',b:'b'}时，会先实例化一个 watcherA 依赖于obj.a，window.watcherTarget 则等于 watcherA。当访问 obj.b 时，getter 函数会调用 dep.depend() 收集依赖 window.watcherTarget，此时就会收集到 watcherA，依赖不对，所以 window.watcherTarget 赋值后重置。


> 这里需要的是，因为是在 get 方法中赋值，所以不能这样写 window.target = new Watcher()，因为实例化执行到 getter 时，实例化 watcher 还未执行完。
> 每个属性会有一个通过闭包得到的 dep 来收集 watcher ，(vue源码)并且通过将 Observer 实例化 def 定义的属性__ob__得到了一份 dep 实例也是用来收集 watcher。但是__ob__中的 dep 的触发时机是在使用 vue.$set 或 vue.set 给数据对象添加新属性。而 defineProperty中的 dep 实例则是在数据对象在取值或值被修改时触发。两者收集的东西是一样的。
> 所以在vue源码中 __ob__ 属性以及 __ob__.dep 的主要作用是为了 vue.$set 添加、删除属性时有能力触发依赖
> 在getter中收集依赖，在setter中触发依赖


整体过程：

```html
<div id="app">
  <p>{{name}}</p>
</div>
<script>
  var app = new Vue({
    el: "#app",
    data:{
      name: 'LewisLen',
      age: '80'
    }
  })
</script>
```

1. 在初始化 initState 阶段，会对数据对象 data 进行劫持，为每个属性添加 getter 和 setter 函数，以及一个 Dep 实例
2. html模版将会被编译（mountComponent）成渲染函数，接着就会创建一个渲染函数的 watcher 实例（触发updateComponent)，对渲染函数求值。求值即调用 watcher 实例中的 get 方法，将实例对象赋值给一个全局变量 window.watcherTarget(Dep.target);，进而触发了数据对象 name 属性的 getter 函数，则 watcher 实例收集到 name 属性放入到 name 属性 dep 实例对象中。当修改 name 属性时，则会触发 name 的 setter 方法，这时就会调用 dep 实例中的 notify 方法去更新视图。

## Vue2.x响应式原理（Object.definePropety)

- 每个Vue Component实例都有一个与之对应的 Watcher 实例
- Vue Data上的属性会被添加到getter和setter属性
- 当Vue Component的 render 函数被执行的时候，data 会被读取，即getter方法会被调用，此时 Vue 会去记录当前 Component 所依赖的所有data（即依赖收集）
- data 被改变时，则会被执行写的操作，即setter会被调用，此时 Vue 会通知所有依赖于此 data 的组件去调用他们的 render 函数进行更新

## Object.definePropety存在的问题

- 对于data是用循环来进行劫持的，对于data属性维护是用for循环的方式，性能方面差一些
- 由于JavaScript的限制，Vue不能监测数组和对象的变化，需要特殊处理


## 参考文章

- http://caibaojian.com/vue-design/art/7vue-reactive.html
- https://juejin.cn/post/6844903561327820808
- https://juejin.cn/post/6932659815424458760
- [vue实例化过程](https://www.cnblogs.com/gerry2019/p/12001661.html)