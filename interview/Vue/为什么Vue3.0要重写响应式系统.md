# 为什么Vue3.0要重写响应式系统

## 响应式原理对比

- Vue2.x: 核心是 Object.definePropety
- Vue3.x: 核心是 Proxy

相对于react和微信小程序对于属性的**侵入式**更改，Vue属于**非侵入式**

> vue 是直接更改数据即可影响视图变化，如：this.num = 100
> React 和 小程序则需要调用指定的封装方法来改变数据再改变视图
> React: this.setState({num:10})
> 小程序: setData({num: 10})

## Vue2.x响应式原理探寻

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
