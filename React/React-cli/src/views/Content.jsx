import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import store from '../store'
import Count from '../store/connect'
import ProductDetail from './ProductDetail'
import ProductList from './ProductList'
import Todo from './Todo'

export default class Content extends Component {
  render() {
    return (
      <div>
        内容区域
        <Route path="/todo"><Todo/></Route>
        <Route path="/productList"><ProductList/></Route>
        <Route path="/productDetail/:id" component={ProductDetail}></Route>
        <Route path="/count">
          <Count store={store}/>
        </Route>
      </div>
    )
  }
}
