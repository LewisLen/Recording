# node

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