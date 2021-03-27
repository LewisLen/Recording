import React, { Component } from 'react';
import './index.css';

export default class Item extends Component {
  render() {
    console.log(this.props)
    const {id,name,done} = this.props;
    return (
        <li className="todo-item" key={id}>
          <label>
            <input type="checkbox" defaultChecked={done}/>
            <span>{name}</span>
          </label>
          <button>删除</button>
        </li>
    )
  }
}
