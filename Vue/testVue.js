class Compile{
  constructor(el,vm){
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    // 获取文档碎片对象，放入内存中减少页面的回流和重绘
    const fragment = this.node2Fragment(this.el);
  }
  isElementNode(node){
    // 1是元素 3是文本节点
    return node.nodeType === 1;
  }
  node2Fragment(el){
    // const childNodes = el.childNodes;
    
  }
}

class MVue{
  constructor(options){
    this.$el = options.el;
    this.$data = options.data;
    this.options = options;
    if(this.$el){
      new Compile();
    }
  }
}