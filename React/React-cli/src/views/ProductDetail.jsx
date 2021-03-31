import React, { Component } from 'react'

export default class ProductDetail extends Component {
  render() {
    console.log(this.props)
    return (
      <div>
        产品{this.props.match.params.id}的详情
      </div>
    )
  }
}
