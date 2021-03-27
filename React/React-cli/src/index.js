import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

ReactDOM.render(
  // 严格模式，检查组件代码
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
