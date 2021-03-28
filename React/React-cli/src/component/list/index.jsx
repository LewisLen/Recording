import React, { Component } from 'react';
import Item from '../item';
import './index.css';

export default class List extends Component {
  // 向子组件传递props事件
  changeItemFlag = (id,done) => {
    // 向父组件App传递值
    this.props.changeListItemFlag(id,done);
  }
  render() {
    const {todoList} = this.props;
    return (
      <div>
        <ul>
          {
            todoList.map(item => {
              return <Item key={item.id} {...item} changeItemFlag={this.changeItemFlag}/>
            })
          }
        </ul>
      </div>
    )
  }
}
