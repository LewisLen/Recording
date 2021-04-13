// 用常量命令统一管理action
import { DECREMENTVALUE, INCREMENTVALUE } from './constant';

export const incrementvalue = data => ({type:INCREMENTVALUE,value:data});
export const decrementvalue = data => ({type:DECREMENTVALUE,value:data});

// 异步action，action的值为函数，异步action中一般都会再调用同步action
export const createAsyncAction = (data,time) => {
  // 这里已经是在store中，所以是有dispatch方法
  return (dispatch) => {
    setTimeout(() => {
      dispatch(incrementvalue(data))
    },time)
  }
}