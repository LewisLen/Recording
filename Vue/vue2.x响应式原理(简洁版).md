# 理解vue2.x响应式(简洁版本)

先看一段代码，因为 JavaScript 是单线程的，只会从上往下执行下去。

```javascript
let a = 1;
let b = 1;
let sumTotal = 0;
let target = null;
target = () => { sumTotal = a + b}
target(); // 执行求和，可得 sumTotal = 2;
a = 2;
// 此时 sumTotal 的值还是2，因为sum函数执行时，a的值还是1，而不是3
console.log(sumTotal) // 2
// 除非再执行一次 target()，sumTotal 才有可能变化
target();
console.log(sumTotal) // 3
```

从上面代码可以看出，只是赋值并不能使得 sumTotal 值改变，而是需要再执行一次 target 函数。所以可以考虑将要运行的 target 函数保存起来，等到 sumTotal 依赖的变量（a、b）值改变时，再执行对应保存的函数。

```javascript
// 新建一个类用来管理函数
class Dep{
  constructor(){
    // 用来保存要执行的函数
    this.subs = []
  }
  depend(){
    // 收集要执行的函数
    this.subs.push(target)
  }
  notify(){
    // 执行保存的函数
    this.subs.forEach(sub => sub())
  }
}
let dep = new Dep();
// 收集依赖
dep.depend();
// 获取一开始的 sumTotal，也可以理解为初始化
target(); // sumTotal为2
a = 10;
// 派发依赖，执行保存的函数
dep.notify(); // sumTotal为11
```

将收集依赖和获取初始值的方法用个函数封装起来

```javascript
function watcher(fn){
  target = fn;
  target();
  // 收集依赖
  dep.depend();
  // 重置全局变量target
}
```