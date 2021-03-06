// 添加数组监测
// 因为没法以数组的索引进行监听，所以只能监听数组本身，有数组的部分方法会改变数组自身，所以当调用部分数组方法时进行监测即可

// 判断是否是对象
function isObject(obj){
  return obj !== null && typeof obj === 'object'
}

// 判断是否是实例自身的属性
function hasOwn(obj,key){
  return Object.prototype.hasOwnProperty.call(obj, key) && !(key in obj);
}

// 根据对象表达式获取对应的值，如obj.a.b
// 在组件中可能是{{ person.name }}
function getValueByObjPath(path){
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

// 将传入的对象走一层 Object.deineProperty 方法来定义其属性
// 主要还是用于定义__ob__属性
const def = (obj,key,value,enumerable) => {
  Object.defineProperty(obj,key,{
    value,
    enumerable: !!enumerable,// 是否可枚举
    writable: true, // 是否可写
    configurable: false // 不可配置被删除
  })
}

// 因为没法以数组的索引进行监听，所以只能监听数组本身，有数组的部分方法会改变数组自身，所以当调用部分数组方法时进行监测即可
// 只对会改变原数组的方法进行改写监测，不会改变原数组则不需要重写
const methodsToPatch = ['push','pop','shift','unshift','splice','sort','reserve'];
// 获取数组原型上的方法{}
const arrayProto = Array.prototype;
// 以 arrayProto 为原型,创建一个含有数组原型方法的对象
const arrayMethods = Object.create(arrayProto);// 相当于 arrayMethods.__proto__ = arrayProto;
// 会将传进来的 value 值的__proto__属性指向 arrayMethods，即 value.__proto__ = arrayMethods;在 value 调用方法时，会根据原型链查找方法
methodsToPatch.forEach(methodName => {
  // 给 arrayMethods 添加同名方法
  arrayMethods[methodName] = function(...args){
    // 调用原数组的方法才能真正的执行
    // 因为这里的方法都是传进来需要被检测的对象调用的，所以 this 就是指传进来需要被检测的对象
    // 在 Observer 类上给每个被劫持的对象都添加了__ob__属性，__ob__ 属性就是Observer实例，所以有 walk 和 observeArray 的方法，则可以给元素进行劫持
    let ob = this.__ob__;
    // this指向的是调用该方法的数组
    const result = arrayProto[methodName].call(this,...args);
    // 添加的元素可能还是对象
    let inserted;// 插入的元素
    switch(methodName){
      // push和unshift的就是插入元素
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      // 可以新增 删除 修改
      // arr.splice(开始的位置,删除的个数,'插入的数组')
      case 'splice':
        inserted = args.slice(2);
        break;
      default:
        break;
    }
    // 如果插入的元素还是数组则需要继续劫持
    if(inserted) ob.observeArray(inserted);
    return result;
  }

})



// 管理 watcher 的类
class Dep{
  constructor(){
    // 存放观察者wather
    this.subs = [];
  }
  addSub(sub){
    this.subs.push(sub)
  }
  // 收集观察者watcher
  depend(){
    // Dep.watcherTarget是全局唯一值
    if(Dep.watcherTarget){
      this.addSub(Dep.watcherTarget);
    }
  }
  // 数据变化，派发watcher执行对应方法
  notify(){
    // 潜复制
    const subs = this.subs.slice();
    for(let i = 0;i<subs.length;i++){
      subs[i].update();
    }
  }
}
Dep.watcherTarget = null;


class Watcher{
  // 变量命名原则：内部数据使用下划线开头，只读数据用$开头
  constructor(data,objPath,callback){
    this._data = data;
    this._objPath = objPath;// 观察的表达式(属性路径)，如obj.a.b 在源码中第一次new Watcher 时传入的是 updateComponent 主要是调用_render(渲染虚拟DOM)和_update(将vnode渲染成真实DOM)函数的作用
    this._callback = callback;// 观察的表达式变化时触发的回调函数
    this._value = this.get();// 得到指定路径的value值，会得到初始值，触发 getter
  }
  get(){
    // 设置 watcher 实例对象为全局属性 watcherTarget
    Dep.watcherTarget = this;
    return getValueByObjPath(this._objPath)(this._data);
  }
  update(){
    this._value = getValueByObjPath(this._objPath)(this._data);
    // 当数据变化 执行回调函数 更新视图
    this._callback();
  }
}


// 相当于声明了一个val变量来做初始值和连接get和set，使val和getter/setter函数形成一个闭包
// 目的就是给data对象的每个属性添加getter和setter方法，进行劫持
function defineReactive(target,key,val){
  // 在__ob__属性中新增一个Dep实例
  let dep = new Dep();
  if(arguments.length === 2){
    // 如果没有传初始值，则读取赋值所传的key/value值
    // 这里如果有多层嵌套对象，那么val就会是下一个嵌套的对象
    // 这里的val = data[key]以及observe(val)对于循环对象变成响应式对象非常关键，会将一个嵌套对象defineReactive完之后再回到外层defineReactive，然后继续下一个data的对象defineReactive
    // var = {a:'aa',b:{c:'cc'},d:'dd'} defineReactive顺序为 a -> c -> b -> d;
    val = target[key]
  }
  // 这里调用obseve的作用是循环递归各个层级的对象，使其都是Observer的实例，最终调用walk方法，使得每个属性都会被defineReactive,拥有getter和setter函数，变成响应式，进行劫持
  // 被 defineReactive 化的属性都通过闭包引用属于自己的 Dep 实例和 childOb对象
  // 这里的 childOb 就是 Observer 的实例
  let childOb = observe(val);
  Object.defineProperty(target,key,{
    enumerable: true,// 可枚举
    configurable: true,
    get(){
      // 当读取name属性时调用
      if(Dep.watcherTarget){
        // 收集依赖
        dep.depend();
        console.log('getter函数被调用，val值为=== ',val);
        if(childOb) childOb.dep.depend();
      }
      return val
    },
    set(newValue){
      // 当设置name属性时调用
      // 当设置属性为对象的时候也要 observe，使其也是 Observer 的实例，最终被新增的属性也被 defineReactive ,拥有getter和setter函数，变成响应式
      console.log('setter函数被调用val值为===',val);
      observe(val);
      if(newValue === val) return;
      val = newValue
      // 通知视图更新
      dep.notify();
      console.log('setter函数被调用newValue值为===',newValue);
    }
  })
}

// 实现各个层级对象的属性能够被侦测（即被观察observe）的类，最终都会被 defineReactive
class Observer{
  constructor(obj){
    this.value = obj;
    // 新增一个Dep类实例，每个Observer的实例都会有个 Dep 实例
    this.dep = new Dep();
    // 这里的 this 是 Observer 的实例
    // 如果直接将this赋值 obj.__ob__ = this; 那么每一个被监控的对象都会有一个__ob__属性，__ob__ 属性上会有 walk 和 observeArray 方法了。但是直接这么定义会导致死循环，一直会去执行 observeArray 或 walk 方法
    // 所以该用 defineProperty 的方法定义 __ob__ 属性，这个属性也可以用来判断对象是否有 getter 和 setter 函数，是否需要被劫持
    def(obj,'__ob__',this);
    if(Array.isArray(obj)){
      obj.__proto__ = arrayMethods;
      // Object.setPrototypeOf(obj,arrayMethods);
      // 如果数组里的是对象则再劫持
      this.observeArray(obj);
    }else{
      this.walk(obj)
    }
  }
  // 遍历每个对象的层级
  walk (obj) {
    const keys = Object.keys(obj); // data属性组成的数组
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i] )
    }
  }
  // 劫持数组里的对象
  observeArray(arr){
    for(let i = 0;i<arr.length;i++){
      observe(arr[i])
    }
  }
}


// 判断传入的数据是否为对象，实现各个层级的属性都能够被 defineReactive
function observe(obj){
  if(!isObject(obj)) return;
  var ob;
  // __ob__ 属性保存的是 Observer 实例且是数据对象自身的属性，是通过 Observer 类中中的 def 定义的
  // 有 __ob__ 属性则表示被 defineReactive 了
  if(typeof obj.__ob__ !== 'undefined' &&
    obj.__ob__ instanceof Observer &&
    hasOwn(obj, '__ob__')){
    ob = obj.__ob__;
  }else{
    ob = new Observer(obj);
  }
  return ob;
}
