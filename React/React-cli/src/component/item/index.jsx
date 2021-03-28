import React, { Component } from 'react';
import './index.css';

export default class Item extends Component {
  state = {
    mouseFlag: false
  }
  // 直接传值，用高阶函数回调
  handleMouse = (flag) => {
    return () => {
      // console.log(flag)
      this.setState({
        mouseFlag:flag
      })
    }
  }
  render() {
    const {id,name,done} = this.props;
    return (
        <li className="todo-item" key={id} onMouseEnter={this.handleMouse(true)} onMouseLeave={this.handleMouse(false)} style={{backgroundColor: this.state.mouseFlag?"#ddd":"#fff"}}>
          <label>
            <input type="checkbox" defaultChecked={done}/>
            <span>{name}</span>
          </label>
          <button style={{display: this.state.mouseFlag?"block":"none"}}>删除</button>
        </li>
    )
  }
}
