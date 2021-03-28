import PubSub from 'pubsub-js';
import React, { Component } from 'react';

export default class SearchList extends Component {
  state = {
    productList: []
  }
  componentDidMount(){
    this.token = PubSub.subscribe('GETPRODUCTLIST', (msg,data) => {
      // console.log("订阅消息======",data.data);
      const tempData = data.data;
      this.setState({
        productList: tempData
      })
      console.log(this.state.productList)
    });
  }
  componentWillUnmount(){
    // 在组件卸载时解除订阅消息
    PubSub.unsubscribe(this.token);
  }
  render() {
    return (
      <div>
        <ul>
          {
            this.state.productList.map(item => {
              return <li key={item._id}>产品：{item.productName} --- 价格：{item.price}</li>
            })
          }
        </ul>
      </div>
    )
  }
}
