import './App.scss';
import React from "react";
import DashboardPage from "./components/dashboard/DashboardPage/DashboardPage";
import {Route, Routes} from "react-router-dom";
import ClientsPage from "./components/clients/ClientsPage/ClientsPage";
import routes from "./routes";
import NotFoundPage from "./components/shared/NotFoundPage/NotFoundPage";

const App = () => (
  <div data-testid="app">
    <Routes>
      <Route path={routes.clientsPage} element={<ClientsPage/>}/>
      <Route path={routes.dashboardPage} element={<DashboardPage/>}/>
      <Route path={'*'} element={<NotFoundPage/>}/>
    </Routes>
  </div>
)

export default App;
