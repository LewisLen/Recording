import React, { Component } from 'react';

export default class Header extends Component {
  handlekeyUp = (event) => {
    let {target,keyCode} = event;
    console.log(keyCode)
    if(keyCode !== 13) return;
    if(target.value.trim() === ''){
      alert('输入不能为空');
      return;
    }
    this.props.addTodoItem({
      id: new Date(),
      name: target.value,
      done: false
    });
    // 添加完代办项之后清除输入框
    target.value = '';
  }
  render() {
    return (
      <div>
        <input type="text" onKeyUp={this.handlekeyUp}/>
      </div>
    )
  }
}
