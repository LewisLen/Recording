// 默认暴露和分别暴露
import React, { Component } from 'react';
import '../node_modules/antd/dist/antd.css';
import './App.css';
import Home from './views/Home';

export default class App extends Component{
  render(){
    return (
      <Home/>
    )
  }
}