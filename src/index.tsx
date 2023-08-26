// @ts-ignore
import {createRoot} from 'react-dom/client';
import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from "./App";
import {Router as RemixRouter} from "@remix-run/router/dist/router";
import {createBrowserRouter} from "react-router-dom";
import routerConfig from "./routerConfig";


// We only want the mock service calls in the development env
// and when disable MSW flag is off
if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_DISABLE_MSW) {
  const {worker} = require('./mocks/browser')
  worker.start()
}

const router: RemixRouter = createBrowserRouter(routerConfig);

const container = document.getElementById('root')
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App router ={router}/>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
