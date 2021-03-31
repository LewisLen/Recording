import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class TodoA extends Component {
  state = {
    productList: []
  }
  componentDidMount(){
    axios.get('/productList').then(res => {
      if(res.data.returnCode === '000'){
        this.setState({
          productList: res.data.data
        })        
      }
    })
  }
  render() {
    return (
      <div>
        <ul>
          {
            this.state.productList.map(item => {
              return (
                <li key={item._id}>
                  <Link key={item._id} to={`/productDetail/${item._id}`}>产品：{item.productName} --- 价格：{item.price}</Link>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}
