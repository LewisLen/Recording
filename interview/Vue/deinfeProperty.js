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

class Watcher{
  // 变量命名原则：内部数据使用下划线开头，只读数据用$开头
  constructor(data,objPath,callback){
    this._data = data;
    this._objPath = objPath;// 属性的路径，如obj.a.b
    this._callback = callback;// 数据变化时触发回调
    this._value = this.get();// 得到指定路径的value值
  }
  get(){
    return getValueByObjPath(this._objPath)(this._data);
  }
  update(){
    this._value = getValueByObjPath(this._objPath)(this._data);
    // 当数据变化 执行回调函数 更新视图
    this._callback();
  }
}

function getValueByObjPath(path){
  // 为了获取数据中多层对象的值 如obj.a.b
  let paths = path.split('.');
  // 函数柯里化
  return function(data){
    let res = data;
    let prop;
    while(prop = paths.shift()){
      res = res[prop]
    }
    return res;
  }
}

// Dep类来管理 Watcher
class Dep{
  constructor(){
    // 存放watcher
    this.subs = []
  }
  // 收集依赖，说白了就是收集数据的变化
  depend(){
    this.addSubs(Dep.target)
  }
  // 派发通知更新，当数据变化之后通知更新视图
  notify(){
    const subs = [...this.subs];
    // 通知每个wathcer作出对应的动作
    subs.forEach( sub => {
      sub.update();
    })
  }
  addSubs(sub){
    this.subs.push(sub)
  }
}
// Dep类上的静态属性，不是实例上的属性，所以是全局唯一的target属性，保证了同一时间只能有一个全局的 Watcher 被计算
Dep.target = null


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
let tempValue = getValueByObjPath('book.prdCode')(obj)
console.log(tempValue)