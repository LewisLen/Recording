import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './index.css';

export default class Footer extends Component {
  static propTypes = {
    todoList: PropTypes.array.isRequired,
    checkAllItem: PropTypes.func.isRequired
  }
  changeAllItemFlag = (event) => {
    this.props.checkAllItem(event.target.checked)
  }
  deleteCheckedItem = () => {
    this.props.deleteCheckedItem();
  }
  render() {
    let {todoList} = this.props;
    const doneCount = todoList.reduce((pre,current) => {
        return pre + (current.done?1:0)
    },0)
    return (
      <div className="todo-footer">
        <div>
          <input type="checkbox" checked={doneCount === todoList.length && todoList.length !== 0 ?true:false} onChange={this.changeAllItemFlag}/>
          已完成 <span>{doneCount}</span> / <span>{todoList.length}</span>
        </div>
        <button onClick={this.deleteCheckedItem}>删除全部选中</button>
      </div>
    )
  }
}
