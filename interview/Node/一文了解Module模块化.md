# 模块化

使用模块化主要能够解决以下问题：

- 变量污染问题，模块化之后每个文件都是独立的作用域
- js文件多也可以逻辑清晰好维护，依赖文件一目了然

## CommonJs

CommonJs 规定，每个模块内部都会有一个变量`module`代表当前模块。module 有个属性 exports 可以对外暴露变量及函数。在另一个模块引入（加载）某个模块，其实就是加载该模块的 module.exports。module.exports 可以导出变量及函数，也可以导出类型的值

```javascript
// 导出对象
module.exports = {
  name: 'Len',
  age: '20'
}
// 等同于
module.exports.name = 'Len';
module.exports.age = '20';
// 都会导出
// { name: 'Len', age: '20' }
```

模块(文件)初始化时，module.exports 和 exports 是指向同一个对象`{}`的，相当于在每个模块的头部有变量声明：

![module.exports](https://ucarecdn.com/af1c810c-72f4-43cb-a0da-fcd67bed2a80/initial.svg)

```javascript
var exports = module.exports;
```

所以当只是导出一些属性时，也可以如下写法：

```javascript
exports.name = 'Len';
exports.age = '20';
// 导出
// { name: 'Len', age: '20' }
```

需要注意的是，如果exports已经导出了一个属性值，就不能再导出一个对象了，因为这相当于修改了exports的对象，是无效的，最终的导出结果是由`module.exports`决定的。

```javascript
exports.age = 20;
exports = {
  name: 'Len'
}
// 导出结果：{ age:20 }
exports.age = 20;
module.exports.name = 'Len';
// 导出结果：{ age: 20, name: 'Len' }
module.exports.name = 'Len';
module.exports = {
  age: 20
};
// 导出结果：{age: 20}
module.exports = {
  name: 'Len'
};
module.exports = {
  age: 20
};
// 导出结果：{age: 20}
module.exports.name = 'Len';
module.exports.age = 20;
// 导出结果：{ name: 'Len', age: 20 }
```

如果想在模块中使用exports，则可以进行指向声明

```javascript
exports = module.exports = {
  a: 'aaa',
  b: 'bbb'
} 
exports.foo = function(){
  console.log('foo...')
}
// 导出结果
// { a: 'aaa', b: 'bbb', foo: [Function] }
let {name,age} = './index.js'
console.log(age);// 20
let a = age + 10; // a = 30
age = 30; // 可以直接被改变 age = 30
let b = age + 10; // b = 40
```

> 重复导入是无效的，只要该文件记载过一次某文件，再次导入是不会生效的

**强烈推荐：优先使用`module.exports`**


## ES模块语法

ES模块导出分为 `export`（分别暴露）、`export default`（默认暴露），和CommonJs加载整体模块不同，ES模块是编译时加载，即需要哪些方法只会加载指定的方法，其它方法不加载。

```javascript
// 分别导出
export const name = 'Len'
export const age = 20

const foo = function(){
  console.log('foo')
}
// 默认导出
export default foo
```

当有默认导出和分别导出同时存在时，则在导出时需注意默认导入在前，分别导入在后。

```javascript
import test, { age, name } from './test';
// 这里的{}并不等同于解构，而是分别导入的一种方式
console.log(age); // 20
let a = age + 10;
console.log(a); // 30 可以进行操作
age = 30;// 报错，这里age是只读的
```

> 需要注意的是，ES Module是静态导入，且导入的值是只读状态，不能够直接被赋值更改
> import声明只能在该文件的最顶部，否则会报错


## CommonJs和ES Module的不同

- CommonJs可以动态导入，为“运行时记载”。ES Module不支持动态导入，只能在文件最顶部导入，为“编译时加载”
- CommonJs导入的值可以修改，ES Module导入的值是只读的，不能直接修改
- CommonJs中的exports和module.exports同时存在且都指向的是另外一个对象时，则后边导出的会覆盖前面导出的。ES Module支持默认导出和分别导出。

- [module.exports和exports的不同](https://blog.tableflip.io/the-difference-between-module-exports-and-exports/)