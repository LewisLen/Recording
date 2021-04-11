import React, { Component } from 'react';
export default class Count extends Component {
  componentDidMount(){
    console.log(this.props)
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

  storeChangeState = () => {
    this.setState({})
  }
  render() {
    return (  
      <div>
        <h1>当前求和值：{this.props.count}</h1>
        <select ref={c => this.selectNumber = c}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
        <button onClick={this.incrementAsync}>-</button>
      </div>
    )
  }
}
