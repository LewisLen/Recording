import axios from 'axios'
import PubSub from 'pubsub-js'
import React, { Component } from 'react'

export default class searchHeader extends Component {
  getProductData = () => {
    axios.get('/productList').then(res => {
      if(res.data.returnCode === '000'){
        // 发布消息
        PubSub.publish('GETPRODUCTLIST', res.data);
      }
    })
  }
  render() {
    return (
      <div>
        <button onClick={this.getProductData}>获取产品列表</button>
      </div>
    )
  }
}
