import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Item from '../item';
import './index.css';


export default class List extends Component {
    // 对props进行限制
    static propTypes = {
      changeListItemFlag: PropTypes.func.isRequired,
      todoList: PropTypes.array.isRequired
    }
  // 向子组件传递props事件
  changeItemFlag = (id,done) => {
    // 向父组件App传递值
    this.props.changeListItemFlag(id,done);
  }
  render() {
    // 直接将父组件的props值传给子组件，或者加一层函数处理关系
    const {todoList,changeListItemFlag} = this.props;
    return (
      <div>
        <ul>
          {
            todoList.map(item => {
              return <Item key={item.id} {...item} changeItemFlag={changeListItemFlag}/>
            })
          }
        </ul>
      </div>
    )
  }
}
