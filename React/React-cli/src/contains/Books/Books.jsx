import { Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';


class Book extends Component {
  addBook = () => {
    console.log(this.bookName.value);
    console.log(this.bookPrice.value);
  }
  render() {
    return (
      <div>
        Books组件
        <Button onClick={this.addBook}>添加书籍</Button>
        
        <input type="text" placeholder="书名" ref={b => this.bookName = b}/>
        <input type="text" placeholder="价格" ref={b => this.bookPrice = b}/>
        <ul>
          <li></li>
        </ul>
      </div>
    )
  }
}

export default connect()(Book)
