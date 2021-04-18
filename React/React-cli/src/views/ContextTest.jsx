import React, { Component } from 'react';

// 创建context对象
const AContext = React.createContext();
const {Provider,Consumer} = AContext;
export default class ContextTest extends Component {
  state = {
    name: 'Len'
  }
  render() {
    return (
      <div>
        A组件
        <Provider value={this.state.name}>
          <Bcomponent/>
        </Provider>
      </div>
    )
  }
}

class Bcomponent extends Component{
  render(){
    return (
      <div>
        B组件
        <Ccomponent/>
      </div>
    )
  }
}

class Ccomponent extends Component{
  // 声明接收context传递的值
  static contextType = AContext;
  render(){
    console.log(this.context)
    return (
      <div>
        C组件: {this.context}
        <Consumer>
          {
            value => {
              // value值就是祖组件传递的值
              return value
            }
          }
        </Consumer>
      </div>
    )
  }
}