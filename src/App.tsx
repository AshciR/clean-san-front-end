import './App.scss';
import React from "react";
import DashboardPage from "./components/dashboard/DashboardPage/DashboardPage";
import NavBarWrapper from "./components/shared/NavBarWrapper/NavBarWrapper";

const App = () => (
  <div data-testid="app">
    <NavBarWrapper>
      <DashboardPage distanceFromNavBar={10}/>
    </NavBarWrapper>
  </div>
)

export default App;
