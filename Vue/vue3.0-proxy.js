let data = {
  msg: 'Hello',
  name: 'Len'
}

// 模拟vue的实例
let vm = {}
// Object.keys循环对象属性
Object.keys(data).forEach(key => {
  // 数据劫持：当访问或者设置vm中的数据时做的一些操作
  Object.defineProperty(vm,key,{
    get(){
      console.log('getter')
      document.querySelector("#app").textContent = data[key];
      return data[key]
    },
    set(newVal){
      console.log('setter');
      data[key] = newVal;
      document.querySelector("#app").textContent = data[key];
      return;
    }
  })
})
console.log(vm.msg)

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