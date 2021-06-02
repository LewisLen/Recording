# 为什么Vue3.0要重写响应式系统

## 响应式原理对比

- Vue2.x: 核心是 Object.definePropety
- Vue3.0: 核心是 Proxy

相对于react和微信小程序对于属性的**侵入式**更改，Vue属于**非侵入式**

> vue 是直接更改数据即可影响视图变化，如：this.num = 100
> React 和 小程序则需要调用指定的封装方法来改变数据再改变视图
> React: this.setState({num:10})
> 小程序: setData({num: 10})

## 探索Vue2.x响应式原理

相信很多用过 Vue 的小伙伴都了解过其响应式原理的核心式`Object.defineProperty`吧，但是大部分也只是知道用了这个知识点，并不了解响应式原理的真正过程。

### 关于Object.defineProperty方法

Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此**对象**。其关键属性`get`和`set`能够监测和设置对象指定属性，换句话说，只要对象有了`getter`和`setter`，那么就可以认为这个对象是**响应式对象**，所以想要达到响应式的目的，那么就需要将所有对象的属性通过该方法来定义。

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
// 可以直接删除初始化已有的属性
delete book.title;
console.log(book);// {type: "web", price: "100"}
Object.defineProperty(book,'price',{
  // configurable为false，属性不可被更改，报错
  enumerable: true,
  value: '1000'
})

var obj = {};
// 使用Object.defineProperty方法定义新属性后，这个属性的特性中configurable，enumerable，writable都为默认的值false
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
    console.log('getter====')
    // 如果没有return值则默认为undefined
    return tempValue;
  },
  // setter函数
  set(newValue){
    // 当设置name属性时调用，能够通过newValue拿到要被设置的值
    // 但是此时还是没法直接更改属性的值，因为属性值都是从getter函数获取的，这里用了一个全局的中间变量来连接getter和setter
    console.log('setter====',newValue)// “LewisLen”
    tempValue = newValue
  }
})
person.name = "LewisLen"
console.log(person.name)// LewisLen
```

> 利用 Object.defineProperty() 方法中的 getter 和 setter 来定义对象属性的行为，就可以称之为**数据劫持**，即可认为被定义的对象是**响应式对象**。

### defineReactive（响应式函数）

从上面的代码中看出，直接更改 person 的 name 属性值，根本没有生效，但是能得到 newValue ，因为属性值都是从 getter 函数中的 return 值得到的。

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

多个属性遍历，有多少个对象就有多少个 Observer 实例

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
  // val设置默认值，为所传的对象属性值
  // 这里需要需要看data的属性值是否是对象
  // 如果val是对象，则需要再走一遍observe，以便给每个对象defineReactive
  // 如果val不是对象，则observe直接return;，只给当前属性(对象)defineReactive
  // 递归处理
  observe(val);
  Object.defineProperty(data,key,{
    enumerable: true,
    configurable: true,
    get(){
      return val
    },
    set(newValue){
      // 当对某个属性赋值时也有看你是对象，所以也需要observe
      observe(val);
      if(val === newValue) return;
      val = newValue
    }
  })
}
```

当设置某个属性值的时候，会触发setter函数，里边的newValue也得被observe()
通过代码可以得知，通过 observe -> Observer -> defineReactive 实现对每个对象的属性递归处理，在每个(层级)属性上添加了 getter 和 setter 函数，也是需要实现响应式，进行劫持，所以需要在 setter 中对添加的 value 值进行 observe。


observe(obj) => 看obj上是否有__ob__属性 => 没有则需要new Observer()观察者实例 => 遍历下一层属性，逐个defineReactive实现响应式。

Observer作用：1.间接递归监听data对象 2. 链接dep对象，调用delete和set数组的变异方法时获取observer的dep通知依赖watcher更新


### Watcher类和Dep

- 依赖：用到数据的地方，称之为依赖，也可以理解为数据
- Watcher：对于 Watcher 类，这是一个比较抽象的概念，应该是一个数据变化从而要发生变化（触发回调方法如派发更新）的这么一个类

比如在双十一搞活动，有预售商品A售卖，那么在预售阶段，买家张三李四等就会去点击预购下定金，taobao后台系统就会在商品A对应的管理系统将买家信息收集起来，这时买家就处于等待阶段，等到商品A开售，taobao系统就会提醒买家支付尾款下单购买，购买之后，taobao商品的状态应该是等待发货，这就完成了发布-订阅模式的流程。
这个例子当中，商品A就是依赖（data）的各类状态（data属性），买家张三李四就是 Watcher 的实例，买家在商品上架之后就可以点击预购，这时候taobao系统就是Dep来管理 Watcher 的一系列动作，收集买家的预售信息就是收集依赖，通知付尾款就是派发通知，买家的一些类动作之后，会引起商品信息（页面）的变化。


```javascript
// Dep类来管理 Watcher
class Dep{
  constructor(){
    // 存放watcher
    this.subs = []
  }
  // 收集依赖，说白了就是收集数据的变化
  depend(){
    this.addSubs(Dep.target)
  }
  // 派发通知更新，当数据变化之后通知更新视图
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
// Dep类上的静态属性，不是实例上的属性，所以是全局唯一的target属性，保证了同一时间只能有一个全局的 Watcher 被计算
Dep.target = null
```

这个时候就需要去收集数据和根据数据的更新来通知 watcher 作出回应从而更新视图了。实例化 watcher 后，实例上的 get 方法就是获取指定路径的方法，也就是说只要在页面模版上渲染了那个属性如`{{person.name}}` 那么自然而然就会触发 person 的 name 属性上的 getter 方法，所以收集数据放在 getter 再好不过了。

```javascript
function defineReactive(data,key,val = data[key]){
  // 每个属性都有一个Dep实例来管理 watcher
  const dep = new Dep();
  observe(val);
  Object.defineProperty(data,key,{
    enumerable: true,
    configurable: true,
    get(){
      dep.depend(watcher实例)
      return val
    },
    set(newValue){
      // 当对某个属性赋值时也有看你是对象，所以也需要observe
      observe(val);
      if(val === newValue) return;
      val = newValue
      console.log('更新视图')
    }
  })
}
```




## Vue2.x响应式原理（Object.definePropety)

- 每个Vue Component实例都有一个与之对应的 Watcher 实例
- Vue Data上的属性会被添加到getter和setter属性
- 当Vue Component的 render 函数被执行的时候，data 会被读取，即getter方法会被调用，此时 Vue 会去记录当前 Component 所依赖的所有data（即依赖收集）
- data 被改变时，则会被执行写的操作，即setter会被调用，此时 Vue 会通知所有依赖于此 data 的组件去调用他们的 render 函数进行更新



> 在getter中收集依赖，在setter中触发依赖

### Dep类和Watcher类

Wathcer 和 Dep 都是比较抽象的概念，
- 把依赖收集到的代码封装成一个Dep类，它专门用来管理依赖，每个Observer的实例，成员中都有一个Dep实例
- Watcher是一个中介，数据发生变化时通过Watcher中转，通知组件
- depend()依赖，通过getter collect as dependency 收集依赖
- notify()通知，通过setter notify（通知）Watcher


- 依赖就是Watcher，只有Watcher触发的getter才会收集依赖，哪个Watcher触发了getter，就把哪个Watcher收集到Dep中
- Dep使用了发布订阅模式，当数据发生变化时，会循环依赖列表，把所有的Watcher都通知一遍
- Watcher把自己设置到全局的一个指定位置，然后读取数据，因为读取了数据，所以会触发这个数据的getter。在getter中就能得到当前正在读取数据的Watcher，并把这个Watcher收到Dep中

## Object.definePropety存在的问题

- 对于data是用循环来进行劫持的，对于data属性维护是用for循环的方式，性能方面差一些
- 由于JavaScript的限制，Vue不能监测数组和对象的变化，需要特殊处理

## Vue3.0 Composition Api涉及动机

## Proxy源码实现

- 没有for循环
- 可以实现数组响应式

```javascript
let _data = {
  msg: 'Hello',
  name: 'Len'
}

const _vm = new Proxy(_data,{
  get(data,key){
    console.log('gettter',' key==',key,' taget[key===]',data[key])
    return data[key]
  },
  set(data,key,newValue){
    console.log('settter',' key==',key,' taget[key===]',data[key],' newValue===',newValue)
    if(data[key] === newValue){
      return;
    }
    data[key] = newValue;
    document.querySelector('#root').textContent = data[key];
  }
})
```
