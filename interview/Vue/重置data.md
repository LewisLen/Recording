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