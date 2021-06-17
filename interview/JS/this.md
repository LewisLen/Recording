# this指向问题

this 在开发过程中经常出现，也是比较容易搞混淆，首先必须明白的是，普通函数this的指向和函数的什么时候定义，定义在哪里是无关的，只和调用时有关。即**this 是一个指针，指向最后调用函数的对象**。

- 箭头函数
- new操作符（new 绑定）
- apply、call和bind（显式\指定绑定）
- 对象方法调用（隐式绑定）
- 函数调用（默认绑定）

## 默认绑定(独立函数调用)

默认绑定，即在默认情况下，fn() 独立调用就相当于 window.fn()，调用时 this 指向的是 window 对象（非严格模式下）。严格模式下则指向的是 undefined，如果加this.属性则会报错。通常是直接调用某个函数，也相当于绑定在 window 对象上调用。

```javascript
// 非严格模式
var name = 'len';
var fn = function(){
  var name = 'lewis'
  console.log(this.name);
}
fn();// 'len' window.fn()也可以调用
 
// var定义来变量name和函数fn，那就相当月在顶层对象window上定义了这两个属性
let name2 = 'len2';
let fn2 = function(){
  console.log(this);// window
  console.log(this.name2);
}
fn2();// undefined
// 这里的let或者const定义的变量不在顶层对象（window）中，所以window中是没有name2和fn2属性的
// 函数里边的this还是指向window

// 严格模式
'use strict'
var name3 = 'len3';
var fn3 = function(){
  console.log(this);// undefined
  console.log(this.name3)
}
fn3();
// 严格模式下，this指向undefined，undefined上没有name3对象，会抛出错误
```


## 对象方法调用

这种情况出现比较多，就是在某个对象上调用方法，那么 this 就指向那个对象

```javascript
var name = 'Len';
var person = {
  name: 'LewisLen',
  fn: fn
}
function fn(){
  console.log(this.name)
}
person.fn();// LewisLen
// 这里只是将person.fn赋值给f，一开始并没有调用，还是那句话，普通函数调用的时候才能确认this指向
var f = person.fn;
f();// len
```




































