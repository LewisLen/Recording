import React, { Component } from 'react';
import './index.css';

export default class Header extends Component {
  handlekeyUp = (event) => {
    let {target,keyCode} = event;
    console.log(keyCode)
    if(keyCode !== 13) return;
    if(target.value.trim() === ''){
      alert('输入不能为空');
      return;
    }
    // 子组件向父组件通信 
    this.props.addTodoItem({
      id: new Date().getTime(),
      name: target.value,
      done: false
    });
    // 添加完代办项之后清除输入框
    target.value = '';
  }
  render() {
    return (
      <input type="text" className="wrap-input" onKeyUp={this.handlekeyUp}/>
    )
  }
}
