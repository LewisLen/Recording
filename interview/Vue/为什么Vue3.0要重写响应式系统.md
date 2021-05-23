# 为什么Vue3.0要重写响应式系统

## 响应式原理对比

- Vue2.x: Object.definePropety
- Vue3.0: Proxy

## Vue响应式原理

Object.defineProperty实现原理

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
