import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './index.css';

export default class Header extends Component {
  // 通过prop-types对props进行限制
  static propTypes = {
    addTodoItem: PropTypes.func.isRequired
  }
  handlekeyUp = (event) => {
    let {target,keyCode} = event;
    if(keyCode !== 13) return;
    if(target.value.trim() === ''){
      alert('输入不能为空');
      return;
    }
    // 子组件向父组件通信，传新增的值给父组件
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
