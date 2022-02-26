import React from 'react';
import './App.scss';
import DueServicesTable from './components/DueServicesTable/DueServicesTable';
import mockDueServices from './components/DueServicesTable/MockDueServicesData';
import DueService from './shared/DueService.model';

const App = () => {
  
  const dueServices: Array<DueService> = mockDueServices;
  
  return (
    <div>
      <DueServicesTable dueServices={dueServices} />
    </div>
  );
}

export default App;
