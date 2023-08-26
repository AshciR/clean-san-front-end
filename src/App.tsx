import './App.scss';
import React, {FC} from "react";
import {RouterProvider} from "react-router-dom";
import {Router as RemixRouter} from "@remix-run/router/dist/router";

interface AppProps {
  router: RemixRouter
}

const App: FC<AppProps> = ({router}: AppProps) => (
  <div data-testid="app">
    <RouterProvider router={router}/>
  </div>
)

export default App;
