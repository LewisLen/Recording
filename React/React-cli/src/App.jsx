// 默认暴露和分别暴露
import React, { Component } from 'react';
import Header from './component/header';
import List from './component/list';

export default class App extends Component{
  state = {
    todoList:[
      {id:'001',name:'吃饭',done:true},
      {id:'002',name:'睡觉',done:false},
      {id:'003',name:'打豆豆',done:true},
    ]
  }
  addTodoItem = (itemObj) => {
    // console.log(value);
    const newTodoList = [
      itemObj,
      ...this.state.todoList
    ]
    this.setState({
      todoList: newTodoList
    })









  }
  render(){
    return (
      <div>
        <Header addTodoItem={this.addTodoItem}/>
        <List todoList={this.state.todoList}/>
      </div>
    )
  }
}

