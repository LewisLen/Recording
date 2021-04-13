import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

// 用thunk中间件来使用异步action

// 1. 创建store
// 2. 建立reducer(函数)来管理store
// const store = createStore(reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) // 创建数据存储仓库

// const store = createStore(reducer);
// 可以使用reducer、异步aciton和Redux Dev Tools
const composeRedux = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}):compose;

const store = createStore(reducer,composeRedux(applyMiddleware(thunk)));
export default store;