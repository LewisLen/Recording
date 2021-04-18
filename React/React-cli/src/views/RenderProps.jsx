import React, { Component } from 'react'

export default class RenderProps extends Component {
  render() {
    return (
      <div>
        <h2>父组件父组件父组件</h2>
        <A render={name => <B name={name}/>}></A>
      </div>
    )
  }
}

class A extends Component{
  state = {name: 'len'}
  render(){
    return (
      <div>
        <h2>组件A</h2>
        {this.props.render(this.state.name)}
      </div>
    )
  }
}


class B extends Component{
  render(){
    return (
      <div>
        <h2>组件B</h2>
        {this.props.name}
      </div>
    )
  }
}