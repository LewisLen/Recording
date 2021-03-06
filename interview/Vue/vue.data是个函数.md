## 为什么Vue组件中的data是一个返回对象的函数

这个问题其实在官网中就已经有提到了，组件是可以复用的Vue实例，有实例相同的选项：data、computed、watch、methods等，并且可以复用任意次数。

当组件被多次引用时，如果直接使用对象作为data，因为对象是**引用类型**，所以被多次引用的组件数据指向的都是同一个引用地址，当一个组件中的data被修改时，其它组件的data也同样的会被修改。

使用函数返回对象则不会出现这种问题，相当于返回的都是一个引用地址不同的新对象，每个组件实例就可以单独维护一份被返回对象的的data。

从vue源码中也可以看出，初始化data的方法是绑定在vue原型方法_init上

```javascript
Vue.prototype._init = function (options) {
  // ...
  // 初始化data
  initState(vm);
  // ...
}
```

可以直接写个类和实例来进行验证：

```javascript
function Person(){}
Person.prototype.data = {
  name: 'Len'
}
var p1 = new Person();
var p2 = new Person();
console.log(p1.data.name) // Len
console.log(p2.data.name) // Len
p2.data.name = 'xiaoming'
console.log(p1.data.name) // xiaoming
console.log(p2.data.name) // xiaoming

// 用函数返回data的形式则可以单独维护data
function Person(){
  this.data = this.data();
}
Person.prototype.data = function(){
  return {
    name: 'len'
  }
}
var p1 = new Person();
var p2 = new Person();
console.log(p1.data.name) // Len
console.log(p2.data.name) // Len
p2.data.name = 'xiaoming'
console.log(p1.data.name) // Len
console.log(p2.data.name) // xiaoming
```

> vue版本已经做了校验，如果组件中的data不是一个函数返回对象的形式则会报错


## Vue中重置data

可能出现的使用场景，form表单中输入框有默认值，提交之后重置为初始值（默认值）

- vm.$data可以获取当前状态下的data
- vm.$options.data可以获取到组件初始化状态下的data

所以重置data有以下几种方式：

- 对data逐个赋值回初始值
- Object.assign(this.$data, this.$options.data())
- 重置data中的某个对象或属性：this.属性 = this.$options.data().属性
- this.$set(this.$data,'属性',this.$options.data().属性)

```javascript
Object.assign(this.$data, this.$options.data())
// 或者
this.data = Object.assign(this.$data, this.$options.data())
// 单独重置某个属性
this.activity = this.$options.data().activity;
// $set
this.$set(this.$data,'属性',this.$options.data().属性)
```

> 这里需要注意的是，需避免使用Vue.set，使用this.$set(this.$data,this.$options.data())则会提示避免在运行时向Vue实例或其根$data添加响应式属性。