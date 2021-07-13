# node

Node可以在前端应用中使用，也可以在服务端应用使用，前者是为了提升研发效率或质量，后者则是保证安全与稳定，其次是关注并发性能，也需要考量平行扩容方案，真正发挥出Node.js的异步驱动特性。因为异步驱动特性，在主线程不被CPU密集型所影响时，可以真正发挥出Node.js高并发特性，可以作为大部分网络I/O较高的后端服务。


## 事件循环

Node.js事件循环的发起点有4个：

- Node.js启动后
- setTimeout回调函数
- setInterval回调函数
- 一次I/O后的回调函数

**微任务**：process.nextTick和Promise。微任务在事件循环中优先级时最高的。并且process.nextTick优先级高于Promise

**宏任务**: setTimeout、setInterval、setImmediate和I/O。宏任务在微任务之后执行。

1. 同步代码
2. 将异步任务插入到微任务队列或者宏任务队列中
3. 执行微任务或者宏任务的回调函数。微队列先于宏队列执行。

## exports和module.exports

`exports`和`module.exports`变量实际上是同一个变量，初始化为空对象`{}`

```javascript
exports.foo = function(){return 'foo'};
exports.bar = function(){return 'bar'};
// 相当于
module.exports.foo = function(){return 'foo'};
module.exports.bar = function(){return 'bar'};
```

如果要输出一个函数或数组，那么只能给module.exports赋值

> 建议使用module.exports = XXX 的方式来输出模块变量

## 全局变量

- global
- process

## 模块

每个模块都会有预先定义好的变量：require、export、module