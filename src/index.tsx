// @ts-ignore
import {createRoot} from 'react-dom/client';
import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";

// We only want the mock service calls in the development env
// and when disable MSW flag is off
if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_DISABLE_MSW) {
  const {worker} = require('./mocks/browser')
  worker.start()
}

const container = document.getElementById('root')
const root = createRoot(container);
root.render(<React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
