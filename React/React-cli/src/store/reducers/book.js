import { ADDBOOK } from '../constant';

const books = [
  {id:'001',bookName: '哈利波特',bookPrice:'79'}
]

export default (state = books,action) => {
  let {type,value} = action;
  switch (type){
    case ADDBOOK:
      return [value,...books]
    default:
      return state
  }
}