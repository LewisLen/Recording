// 默认暴露和分别暴露
import React, { Component } from 'react';
import './App.css';
import Footer from './component/footer';
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
  // 新增一个todo项
  addTodoItem = (itemObj) => {
    const newTodoList = [
      itemObj,
      ...this.state.todoList
    ]
    this.setState({
      todoList: newTodoList
    })
  }
  // 根据子组件checkbox值改变state数据状态
  updateItemFlag = (id,done) => {
    const newTodoList = this.state.todoList.map(itemObj => {
      // 如果匹配上id，则改变done的值
      if(itemObj.id === id) return {...itemObj,done}
      return itemObj
    })
    this.setState({
      todoList:newTodoList
    })
  }
  // 删除item
  deleteItem = (id) => {
    // console.log(id)
    const newTodoList = this.state.todoList.filter((item) => {
      return item.id !== id;
    })
    this.setState({
      todoList:newTodoList
    })
  }
  render(){
    return (
      <div className="todo-wrap">
        <Header addTodoItem={this.addTodoItem}/>
        <List todoList={this.state.todoList} changeListItemFlag={this.updateItemFlag} deleteItem={this.deleteItem}/>
        <Footer/>
      </div>
    )
  }
}

