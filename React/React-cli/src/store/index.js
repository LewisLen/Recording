import { createStore } from 'redux';
import reducer from './reducer';

// 1. 创建store
// 2. 建立reducer(函数)来管理store
const store = createStore(reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) // 创建数据存储仓库
// const store = createStore(reducer);
export default store;