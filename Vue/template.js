
/*
1. 获取模板
2. 将数据渲染到模板中
3. 将模板插入到页面
*/ 

function MyVue(options){
  // 变量命名原则：内部数据使用下划线开头，只读数据用$开头
  // 获取渲染数据
  this._data = options.data;
  this._el = options.el;
  // 获取要挂载的节点，即获取模板
  this.$el = this._templateDOM = document.querySelector(this._el);
  // 获取挂载父节点
  this._parent = this._templateDOM.parentNode;
  // 渲染
  this.render();
}

// render将模版渲染到页面中
MyVue.prototype.render = function(){
  this.compiler();
}

// 编译模版，将数据插入到模版中
MyVue.prototype.compiler = function(){
  // 复制一份挂载节点
  let realHTMLDOM = this._templateDOM.cloneNode(true);
  // 将挂载节点子元素{{}}中的值赋值为data值
  compiler(realHTMLDOM,this._data);
  this.update(realHTMLDOM);
}

MyVue.prototype.update = function(realDOM){
  // 替换元素
  this._parent.replaceChild(realDOM,document.querySelector('#app'))
}

// Vue源码中template是字符串模版 -> VNode -> 真正的DOM
function compiler(template,data){
  // 匹配双花括号里边的内容
  let reg = /\{\{(.+?)\}\}/g;
  // 包括换行、元素节点，所以这里有5个子节点
  // [换行的文本节点(内容为空)，元素节点p，换行的文本节点(内容为空),元素节点p,换行的文本节点(内容为空)]
  let childNodes = template.childNodes;
  for(let i = 0;i < childNodes.length;i++){
    // type 1元素节点 3文本节点
    let type = childNodes[i].nodeType;
    // 判断文本节点里是否有双花括号{{}}，然后将值插入
    if(type === 3){
      // nodeValue 属性返回或设置当前节点的值
      let txt = childNodes[i].nodeValue;
      // [空值,{{name}},空值,{{message}},空值]
      // 只要匹配到花括号里的文本，就会调用一次回调函数
      txt = txt.replace(reg,function(matchContent,groupContent){
        // 回调函数的第0个参数表示正则匹配到的内容            
        console.log('回调函数第0个参数matchContent',matchContent)
        // 回调函数的第n个参数则表示正则中的第n组
        // groupContent参数要看正则表达式的分组情况，一个括号为一组，所以这里就表示第1组，即会获得双花括号内的变量名
        console.log('回调函数第1个参数groupContent',groupContent)
        let key = groupContent.trim(); // 去除两边空格
        // 为了获取数据中多层对象的值 如obj.a.b
        let value = getValueByObjPath(key)(data);
        // let value = data[key];
        // 返回值将替换掉第一个参数匹配到的结果，即会替换双花括号里边的内容
        return value;
      });
      childNodes[i].nodeValue = txt;
    }else if(type === 1){
      // 元素节点，判断是否有子元素
      // 递归处理
      compiler(childNodes[i],data);
    }
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