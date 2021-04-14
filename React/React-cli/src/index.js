import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import store from './store';

const app = (
  <Provider store={store}>
    {/* 严格模式，检查组件代码 */}
    <React.StrictMode>  
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  </Provider>
)


ReactDOM.render(
  app,
  document.getElementById('root')
);
