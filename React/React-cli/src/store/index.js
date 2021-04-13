import { applyMiddleware, compose, createStore } from 'redux';
// 用thunk中间件来使用异步action
import thunk from 'redux-thunk';
import reducer from './reducer';

// 1. 创建store
// 2. 建立reducer(函数)来管理store

/*
常规reducer管理store
const store = createStore(reducer);

使用Redux Dev Tools
const store = createStore(reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
*/


// 可以使用reducer、异步aciton和Redux Dev Tools
const composeRedux = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}):compose;

const store = createStore(reducer,composeRedux(applyMiddleware(thunk)));
export default store;