# 为什么Vue3.0要重写响应式系统

## 响应式原理对比

- Vue2.x: 核心是 Object.definePropety
- Vue3.0: 核心是 Proxy

相对于react和微信小程序对于属性的**侵入式**更改，Vue属于**非侵入式**

## 探索Vue2.x响应式原理

相信很多用过 Vue 的小伙伴都了解过其响应式原理的核心式`Object.defineProperty`吧，但是大部分也只是知道用了这个知识点，并不了解响应式原理的真正过程。

### 关于Object.defineProperty方法

Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此**对象**。

```javascript
var book = {
  title: 'js',
  type: 'web'
}
Object.defineProperty(book,'price',{
  // 表示对象的属性是否可以被删除，以及除 value 和 writable 特性外的其他特性是否可以被修改。默认为false
  configurable: false,
  // 是否只读，默认是false，只有为true时，才能通过该方法改变对象属性的值
  writable: false,
  // 是否可以被枚举，默认是false，也就是不可枚举。只有为true时，才能被for...in循环出来
  enumerable: false,
  value: '100'
})
// 因为price属性被设置为false只读不可修改，所以这里的赋值是无效的
book.price = '98';
console.log(book.price); // 100
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
```

也就是说 Object.defineProperty 方法可以新增和修改对象的属性，相对于直接对属性的赋值，该方法还有其它的设置。响应式涉及到主要还是`get`和`set`属性，属性对应有`getter`和`setter`方法

```javascript
let person = {}
Object.defineProperty(person,'name',{
  // getter函数
  get(){
    // 当读取name属性时调用
    console.log('getter====')
    return 'Len'// return默认是undefined
  },
  // setter函数
  set(newValue){
    // 当设置name属性时调用
    console.log('setter====',newValue)// “LewisLen”
    return "Lewis"// return默认是undefined
  }
})
person.name = "LewisLen"
console.log(person.name)// Len
```

### defineReactive（响应式函数）

从上面的代码中看出，直接更改obj的属性值，根本没有生效，但是能捕获到newValue，这是属性值都是从get的返回值中获取。

```javascript
let person = {}
// 相当于在最外层加个中间的变量val，和getter/setter形成一个闭包
function defineReactive(target,key,val){
  Object.defineProperty(target,key,{
    enumerable: true,
    configurable: true,
    get(){
      // 当读取name属性时调用
      console.log('getter====')
      return temp
    },
    set(newValue){
      // 当设置name属性时调用
      console.log('setter====',newValue)
      if(val === newValue) return;
      temp = newValue
    }
  })
}
defineReactive(person,'name',"Len");
person.name = "LewisLen"
console.log(person)// "LewisLen"
```





Vue通过Object.defineProperty的 getter/setter 对收集的依赖项进行监听,在属性被访问和修改时通知变化,进而更新视图数据。Vue数据响应式变化主要涉及 Observer, Watcher , Dep 这三个主要的类；因此要弄清Vue响应式变化需要明白这个三个类之间是如何运作联系的；以及它们的原理，负责的逻辑操作。






## Vue2.x响应式原理（Object.definePropety)

- 每个Vue Component实例都有一个与之对应的 Watcher 实例
- Vue Data上的属性会被添加到getter和setter属性
- 当Vue Component的 render 函数被执行的时候，data 会被读取，即getter方法会被调用，此时 Vue 会去记录当前 Component 所依赖的所有data（即依赖收集）
- data 被改变时，则会被执行写的操作，即setter会被调用，此时 Vue 会通知所有依赖于此 data 的组件去调用他们的 render 函数进行更新



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
  get(target,key){
    console.log('gettter',' key==',key,' taget[key===]',target[key])
    return target[key]
  },
  set(target,key,newValue){
    console.log('settter',' key==',key,' taget[key===]',target[key],' newValue===',newValue)
    if(target[key] === newValue){
      return;
    }
    target[key] = newValue;
    document.querySelector('#root').textContent = target[key];
  }
})
```
