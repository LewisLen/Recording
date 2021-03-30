// 默认暴露和分别暴露
import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import '../node_modules/antd/dist/antd.css';
import './App.css';
import Nav from './views/Nav';
import Search from './views/Search';
import Todo from './views/Todo';

export default class App extends Component{
  render(){
    return (
      <div>
        <Nav/>
        <Switch>
          <Route path="/todo">
            <Todo />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
        </Switch>
      </div>
    )
  }
}