import React, { Component } from 'react'
import '../assets/css/style.css'
import Content from './Content'
import Header from './Header'
import SideBar from './SideBar'

export default class Home extends Component {
  render() {
    return (
      <div>
        <SideBar/>
        <div className="content-wrap">
          <Header/>
          <Content/>
        </div>
      </div>
    )
  }
}
