import { DECREMENTVALUE, INCREMENTVALUE } from './constant';
// import store from './index';
// 统一管理action
export const incrementvalue = data => ({type:INCREMENTVALUE,value:data});
export const decrementvalue = data => ({type:DECREMENTVALUE,value:data});

console.log(incrementvalue)
// 异步action，action的值为函数，异步action中一般都会再调用同步action
export const createAsyncAction = (data,time) => {
  // 这里已经时在store中，所以是有dispatch方法
  return (dispatch) => {
    setTimeout(() => {
      // store.dispatch(incrementvalue(data))
      dispatch(incrementvalue(data))
    },time)
  }
}