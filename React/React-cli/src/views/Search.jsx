import React, { Component } from 'react'
import SearchHeader from '../component/searchHeader'
import SearchList from '../component/searchList'

export default class Search extends Component {
  render() {
    return (
      <div>
        <SearchHeader/>
        <SearchList/>
      </div>
    )
  }
}
