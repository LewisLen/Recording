import React, { Component } from 'react';
import Item from '../item';
import './index.css';

export default class List extends Component {
  render() {
    const {todoList} = this.props;
    return (
      <div>
        <ul>
          {
            todoList.map(item => {
              return <Item key={item.id} {...item}/>
            })
          }
        </ul>
      </div>
    )
  }
}
