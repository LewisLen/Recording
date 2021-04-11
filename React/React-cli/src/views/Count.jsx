import React, { Component } from 'react';
import store from '../store';

export default class Count extends Component {
  state = store.getState()
  componentDidMount(){
    store.subscribe(this.storeChangeState)
  }
  increment = () => {
    const selectVal = parseInt(this.selectNumber.value);
    const action ={
      type:'INCREMENTVALUE',
      value: selectVal
    }
    store.dispatch(action)
  }
  decrement = () => {
    const selectVal = parseInt(this.selectNumber.value);
    const action ={
      type:'DECREMENTVALUE',
      value: selectVal
    }
    store.dispatch(action)
  }
  storeChangeState = () => {
    this.setState({})
  }
  render() {
    return (  
      <div>
        <h1>当前求和值：{store.getState().count}</h1>
        <select ref={c => this.selectNumber = c}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
      </div>
    )
  }
}
