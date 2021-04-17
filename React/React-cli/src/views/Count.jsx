import { Button } from 'antd';
import React, { Component } from 'react';
import Books from '../contains/Books/Books';

export default class Count extends Component {
  componentDidMount(){
    // store通过props来获取
    // console.log(this.props)
  }
  increment = () => {
    const selectVal = parseInt(this.selectNumber.value);
    this.props.increment(selectVal)
  }
  decrement = () => {
    const selectVal = parseInt(this.selectNumber.value);
    this.props.decrement(selectVal)
  }
  incrementAsync = () => {
    const selectVal = parseInt(this.selectNumber.value);
    this.props.incrementAsync(selectVal,1000)
  }
  render() {
    return (  
      <div>
        <h1>当前求和值：{this.props.count}</h1>
        <h1>总书籍数：{this.props.books.length}</h1>
        <select ref={c => this.selectNumber = c}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <div>
          <Button type="primary" onClick={this.increment}>加</Button>
          <Button type="primary" onClick={this.decrement}>减</Button>
          <Button type="primary" onClick={this.incrementAsync}>异步加</Button>
        </div>
        <Books/>
      </div>
    )
  }
}
