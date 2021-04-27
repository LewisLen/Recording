# Vue相关知识点集合

## 父子组件生命周期

当有父子组件时，其生命周期渲染顺序为：

加载渲染过程：父组件 beforeCreate -> 父组件 created -> 父组件 beforeMount -> 子组件 beforeCreate -> 子组件 created -> 子组件 beforeMount -> 子组件 mounted -> 父组件 mounted
会先渲染父组件到beforeMount，然后将子组件渲染完，最后是渲染完父组件（mounted）








- data为什么是一个函数返回对象的形式
- v-if 是真正的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件组件适当地被销毁和重建；也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 的 “display” 属性进行切换。
所以，v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景；v-show 则适用于需要非常频繁切换条件的场景。
- 直接给一个数组项赋值，Vue 能检测到变化吗？

- 生命周期
加载渲染过程
父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

子组件更新过程
父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

父组件更新过程
父 beforeUpdate -> 父 updated

销毁过程
父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

- keep-alive

keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，避免重新渲染 ，其有以下特性：

一般结合路由和动态组件一起使用，用于缓存组件；
提供 include 和 exclude 属性，两者都支持字符串或正则表达式， include 表示只有名称匹配的组件会被缓存，exclude 表示任何名称匹配的组件都不会被缓存 ，其中 exclude 的优先级比 include 高；
对应两个钩子函数 activated 和 deactivated ，当组件被激活时，触发钩子函数 activated，当组件被移除时，触发钩子函数 deactivated。


1. 水平垂直居中	
2. 盒子模型
3. eventBus.js的原理
4. data(){return }的原因
5. 对象或者数组视图没变化

1.vue和jq的区别
2.核心：数据劫持、组件开发、单项数据流-父子组件
3.computed(计算缓存)使用常见、和watch以及methods的区别
4.双向数据绑定的实现 v-model
5.vuex使用 localStorage Session
6.vue-router使用 传参的却别  history模式服务端也需要做调整
7.vue-router页面栈管理
8.公共组件
9.移动端布局rem vw vh
10.js基础
11.http协议 https网络相关

### 父组件如何获取子组件的数据，子组件如何获取父组件的数据，父子组件如何传值？


### watch 和 computed的区别？



### vue怎么实现强制刷新组件？



### $nextTick用过吗，有什么作用？


### vue和jq的区别

### vue的核心-数据劫持

```javascript

var data = {
    name:'fang'
}
 
Object.keys(data).forEach(function(key){
    Object.defineProperty(data,key,{
        enumerable:true,
        configurable:true,
        get:function(){
            console.log('get');
        },
        set:function(){
            console.log('监听到数据发生了变化');
        }
    })
})；
data.name //控制台会打印出 “get”
data.name = 'fangpeng' //控制台会打印出 "监听到数据发生了变化"

```


1.vue和jq的区别
2.核心：数据劫持、组件开发、单项数据流-父子组件
3.computed(计算缓存)使用常见、和watch以及methods的区别
4.双向数据绑定的实现 v-model
5.vuex使用 localStorage Session
6.vue-router使用 传参的却别  history模式服务端也需要做调整
7.vue-router页面栈管理
8.公共组件
9.移动端布局rem vw vh
10.js基础
11.http协议 https网络相关

### 面试题

1. created和mounted的区别
2. data写成函数返回的形式，没有写成一个对象
3. 过滤，computed和methods的区别
4. 数组的方法
5. css水平垂直居中的方法
6. 跨域
7. 盒子模型，margin-bottom: 15px
8. vue-router传参 params query


## 数据类型

### 基本数据类型
 
- Undefined(typeof值为"undefined")
- Null(typeof值为"object")
- Boolean(typeof值为"boolean")
- Number(typeof值为"number")
- String(typeof值为"string")
- Symbol(typeof值为"symbol")

### 区分[]和{}

Object.prototype.toString.call([]) // "[object Array]"
Object.prototype.toString.call({}) // "[object Object]"

### 区别null和{}

{}是一个不完全为空的对象，原型链上还有Object
[]也可以说是一个不完全为空的对象，原型链上有Array和Object
而null则是一个完全空的对象，原型链上什么都没有
初始化一个空对象应该用null，而{}更像是初始化对象

null instanceof Null 报错
null instanceof Object  // false
[] instanceof Array  // true
[] instanceof Object  // true
{} instanceof Object  // true
Boolean([])  true
Boolean({})  true
Boolean(null) false

### 区分null和undefined

null和undefined是两种不同的数据类型

undefined表示未定义的变量，而null则表示一个“空”的值
0是一个数值，''表示长度为0的字符串，而null则表示为空


### 创建一个类

class Point(){
 constructor(x,y){
  this.x = x;
  this.y = y;
 }
 toString(){
  return this.x + this.y
 }
}

继承

class ColorPoint extends Point{
 constructor(x,y,color){
  super(x,y);
  this.color = color;
 }
 toString(){

 }
}

### 数据去重

### 数组的方法


### 盒子模型

W3C盒子模型和IE盒子模型

盒模型的组成，由里向外content,padding,border,margin.

在IE盒子模型中，width表示content+padding+border这三个部分的宽度

在标准的盒子模型中，width指content部分的宽度

box-sizing的使用

box-sizing: content-box 是W3C盒子模型
box-sizing: border-box 是IE盒子模型
box-sizing的默认属性是content-box


## vue面试题


### vue中如何重置data


```javascript
Object.assign(this.$data,this.$options.data())

```


this.$data获取当前状态下的data
this.$options.data()获取该组件初始状态下的data。


### 父组件如何获取子组件的数据，子组件如何获取父组件的数据，父子组件如何传值？


### watch 和 computed的区别？



### vue怎么实现强制刷新组件？



### $nextTick用过吗，有什么作用？





### 水平垂直居中

水平： justify-content: center
垂直： align-items： center




### vue中的data为什么是一个函数返回的形式

而不是直接一个对象

### vue中：key的作用


### 输入url到渲染页面发生了什么

script和style是同步和异步的
304

### 移动端适配

- 了解node？用过什么功能？
- template是怎么渲染的



### vue和jq的区别

### vue的核心-数据劫持

```javascript

var data = {
    name:'fang'
}
 
Object.keys(data).forEach(function(key){
    Object.defineProperty(data,key,{
        enumerable:true,
        configurable:true,
        get:function(){
            console.log('get');
        },
        set:function(){
            console.log('监听到数据发生了变化');
        }
    })
})；
data.name //控制台会打印出 “get”
data.name = 'fangpeng' //控制台会打印出 "监听到数据发生了变化"

```


1.vue和jq的区别
2.核心：数据劫持、组件开发、单项数据流-父子组件
3.computed(计算缓存)使用常见、和watch以及methods的区别
4.双向数据绑定的实现 v-model
5.vuex使用 localStorage Session
6.vue-router使用 传参的却别  history模式服务端也需要做调整
7.vue-router页面栈管理
8.公共组件
9.移动端布局rem vw vh
10.js基础
11.http协议 https网络相关

### 面试题

1. created和mounted的区别
2. data写成函数返回的形式，没有写成一个对象
3. 过滤，computed和methods的区别
4. 数组的方法
5. css水平垂直居中的方法
6. 跨域
7. 盒子模型，margin-bottom: 15px
8. vue-router传参 params query


## 数据类型

### 基本数据类型
 
- Undefined(typeof值为"undefined")
- Null(typeof值为"object")
- Boolean(typeof值为"boolean")
- Number(typeof值为"number")
- String(typeof值为"string")
- Symbol(typeof值为"symbol")

### 区分[]和{}

Object.prototype.toString.call([]) // "[object Array]"
Object.prototype.toString.call({}) // "[object Object]"

### 区别null和{}

{}是一个不完全为空的对象，原型链上还有Object
[]也可以说是一个不完全为空的对象，原型链上有Array和Object
而null则是一个完全空的对象，原型链上什么都没有
初始化一个空对象应该用null，而{}更像是初始化对象

null instanceof Null 报错
null instanceof Object  // false
[] instanceof Array  // true
[] instanceof Object  // true
{} instanceof Object  // true
Boolean([])  true
Boolean({})  true
Boolean(null) false

### 区分null和undefined

null和undefined是两种不同的数据类型

undefined表示未定义的变量，而null则表示一个“空”的值
0是一个数值，''表示长度为0的字符串，而null则表示为空


### 创建一个类

class Point(){
 constructor(x,y){
  this.x = x;
  this.y = y;
 }
 toString(){
  return this.x + this.y
 }
}

继承

class ColorPoint extends Point{
 constructor(x,y,color){
  super(x,y);
  this.color = color;
 }
 toString(){

 }
}

### 数据去重

### 数组的方法


### 盒子模型

W3C盒子模型和IE盒子模型

盒模型的组成，由里向外content,padding,border,margin.

在IE盒子模型中，width表示content+padding+border这三个部分的宽度

在标准的盒子模型中，width指content部分的宽度

box-sizing的使用

box-sizing: content-box 是W3C盒子模型
box-sizing: border-box 是IE盒子模型
box-sizing的默认属性是content-box


## vue面试题


### vue中如何重置data


```javascript
Object.assign(this.$data,this.$options.data())

```


this.$data获取当前状态下的data
this.$options.data()获取该组件初始状态下的data。


### 父组件如何获取子组件的数据，子组件如何获取父组件的数据，父子组件如何传值？


### watch 和 computed的区别？



### vue怎么实现强制刷新组件？



### $nextTick用过吗，有什么作用？





### 水平垂直居中

水平： justify-content: center
垂直： align-items： center




### vue中的data为什么是一个函数返回的形式

而不是直接一个对象

### vue中：key的作用


### 输入url到渲染页面发生了什么

script和style是同步和异步的
304

### 移动端适配