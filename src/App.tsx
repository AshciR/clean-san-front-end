import React from 'react';
import './App.scss';
import DueServicesTable from './components/DueServicesTable/DueServicesTable';
import MOCK_DUE_SERVICES from './components/DueServicesTable/MockDueServicesData';
import DueService from './shared/DueService.model';

const App = () => {
  
  // const dueServices: Array<DueService> = MOCK_DUE_SERVICES;
  const dueServices: Array<DueService> = [];
  
  return (
    <div data-testid="app">
      <DueServicesTable dueServices={dueServices} />
    </div>
  );
}

export default App;
