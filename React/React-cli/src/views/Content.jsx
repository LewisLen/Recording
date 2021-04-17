import React, { Component, lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
// import Count from '../contains/Count/Count'
// import ProductDetail from './ProductDetail'
// import ProductList from './ProductList'
// import Todo from './Todo'

const Count = lazy(() => import('../contains/Count/Count'));
const ProductDetail = lazy(() => import('./ProductDetail'));
const ProductList = lazy(() => import('./ProductList'));
const Todo = lazy(() => import('./Todo'));
export default class Content extends Component {
  render() {
    return (
      <div>
        内容区域
        <Suspense fallback={<h1>Loading...</h1>}>
          <Route path="/todo"><Todo/></Route>
          <Route path="/productList"><ProductList/></Route>
          <Route path="/productDetail/:id" component={ProductDetail}></Route>
          <Route path="/count">
            <Count/>
          </Route>
        </Suspense>
      </div>
    )
  }
}
