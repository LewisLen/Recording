import { DECREMENTVALUE, INCREMENTVALUE } from './constant';
// 统一管理action
export const incrementvalue = data => ({type:INCREMENTVALUE,value:data});
export const decrementvalue = data => ({type:DECREMENTVALUE,value:data});