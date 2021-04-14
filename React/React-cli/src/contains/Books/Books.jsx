import { Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addBook } from '../../store/actions/book';


class Book extends Component {
  addBook = () => {
    this.props.addBook({
      id: new Date().getTime(),
      bookName: this.bookName.value,
      bookPrice: this.bookPrice.value
    })
  }
  render() {
    console.log(this.props)
    return (
      <div>
        Books组件
        <Button onClick={this.addBook}>添加书籍</Button>
        <h2>Count: {this.props.count}</h2>
        <input type="text" placeholder="书名" ref={b => this.bookName = b}/>
        <input type="text" placeholder="价格" ref={b => this.bookPrice = b}/>
        <ul>
          {
            this.props.bookList.map(item => {
              return <li key={item.id}>{item.bookName}===={item.bookPrice}</li>
            })
          }
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  let {BookReducer,CountReducer} = state;
  return {
    bookList:BookReducer,
    count:CountReducer.count
  }
}
const mapDispatchToProps = {
  addBook
}

export default connect(mapStateToProps,mapDispatchToProps)(Book)
