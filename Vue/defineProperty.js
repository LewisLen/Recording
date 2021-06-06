// 观察方法（入口方法）
function observe(obj){
  // 必须保证要观察的data是对象，才能够用被 defineReactive
  if(typeof obj !== 'object' || obj === null) return;
  new Observer(obj);
}
class Observer{
  constructor(obj){
    this.value = obj;
    // this.dep = new Dep();
    // 则Observer实例上都会保存数据对象本身，以及一个dep实例
    // Observer实例的dep也是用来收集 watcher 只是触发的时机和depfineProperty中dep收集到的watcher不一样
    // def(obj,'__ob__',this)
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
  // 如果val不是对象，则observe直接return;只给当前属性(对象)defineReactive
  const dep = new Dep();// 用于收集watcher实例（函数方法） 每个属性字段都通过闭包的形式引用属于自己的Dep实例对象
  // 被defineReactive化的属性都通过闭包引用属于自己的 Dep 实例和 childOb对象
  // 这里的childOb就是Observer的实例
  // let childOb = observe(val);
  observe(val);
  Object.defineProperty(data,key,{
    enumerable: true,
    configurable: true,
    get(){
      dep.depend(Dep.watcherTarget);
      // if(childOb) childOb.dep.depend();
      return val
    },
    set(newValue){
      console.log('getter被调用===',newValue)
      // 当对某个属性赋值时也有看你是对象，所以也需要observe
      observe(val);
      if(val === newValue) return;
      val = newValue
      // 如果有数据更新，则派发依赖，更新视图
      dep.notify();
    }
  })
}

// Watcher类
class Watcher{
  // 变量命名原则：内部数据使用下划线开头，只读数据用$开头
  constructor(data,objPath,callback){
    this._data = data;
    this._objPath = objPath;// 观察的表达式(属性路径)，如 obj.a.b 在源码中第一次new Watcher 时传入的是 updateComponent 主要是调用_render(渲染虚拟DOM)和_update(将vnode渲染成真实DOM)函数的作用
    this._callback = callback;// 观察的表达式变化时触发的回调函数
    this._value = this.get();// 得到指定路径的value值
  }
  get(){
    // 设置 watcher 实例对象为全局属性 watcherTarget
    Dep.watcherTarget = this;
    const value = getValueByObjPath(this._objPath)(this._data);
    Dep.watcherTarget = null;
    return value;
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

// Dep类来管理 Watcher实例
class Dep{
  constructor(){
    // 存放watcher
    this.subs = []
  }
  // 收集依赖，说白了就是收集数据的变化
  depend(){
    if(Dep.watcherTarget) this.addSubs(Dep.watcherTarget);
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
// window.watcherTarget也是一样的，只要是全局属性即可
Dep.watcherTarget = null;