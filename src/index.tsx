import './index.scss';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {toast} from 'react-toastify';

import App from './App/App';

toast.configure({
  pauseOnHover: false,
  theme: 'colored',
});
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
