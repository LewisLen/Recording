import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class SideBar extends Component {
  render() {
    return (
      <div className="len-sidebar">
        侧边栏区域
        <Link to="/todo">Todo</Link>
        <Link to="/productList">Search</Link>
      </div>
    )
  }
}
