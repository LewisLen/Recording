// 观察方法（入口方法）
function observe(obj){
  // 必须保证要观察的data是对象，才能够用被 defineReactive
  if(typeof obj !== 'object' || obj === null) return;
  new Observer(obj);
}
class Observer{
  constructor(obj){
    this.walk(obj)
  }
  // 遍历每个对象的属性
  walk (obj) {
    // data属性组成的数组
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      // 给data属性对象添加getter和setter方法
      defineReactive(obj, keys[i])
    }
  }
}
function defineReactive(data,key,val = data[key]){
  // val设置默认值，为所传的对象属性值
  // 这里需要需要看data的属性值是否是对象
  // 如果val是对象，则需要再走一遍observe，以便给每个对象defineReactive
  // 如果val不是对象，则observe直接return;，只给当前属性(对象)defineReactive
  observe(val);
  Object.defineProperty(data,key,{
    enumerable: true,
    configurable: true,
    get(){
      return val
    },
    set(newValue){
      // 当对某个属性赋值时也有看你是对象，所以也需要observe
      observe(val);
      if(val === newValue) return;
      val = newValue
      console.log('更新视图')
    }
  })
}

let obj = {
  book:{
    prdCode: 'BOOK0001',
    detail:{
      price: '69',
      subscribe:{
        title: 'Kindle'
      }
    }
  },
  msg: '书籍是人类进步的阶梯',
}