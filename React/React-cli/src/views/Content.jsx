import React, { Component, lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
// import Count from '../contains/Count/Count'
// import ProductDetail from './ProductDetail'
// import ProductList from './ProductList'
// import Todo from './Todo'

const Count = lazy(() => import('../contains/Count/Count'));
const ProductDetail = lazy(() => import('./ProductDetail'));
const ProductList = lazy(() => import('./ProductList'));
const HooksCount = lazy(() => import('./HooksCount'));
const Todo = lazy(() => import('./Todo'));
const ContextTest = lazy(() => import('./ContextTest'));
const RenderProps = lazy(() => import('./RenderProps'));
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
          <Route path="/HooksCount">
            <HooksCount/>
          </Route>
          <Route path="/ContextTest">
            <ContextTest/>
          </Route>
          <Route path="/RenderProps">
            <RenderProps/>
          </Route>
        </Suspense>
      </div>
    )
  }
}
