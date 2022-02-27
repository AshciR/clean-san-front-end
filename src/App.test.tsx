import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';


describe('App', () => {

  it('renders the application', () => {
    render(<App />);
    const app = screen.getByTestId('app');
    expect(app).toBeInTheDocument();
  });

  it('renders the due services component', () => {
    render(<App />);
    const dueServicesComponent = screen.getByTestId('due-services-table');
    expect(dueServicesComponent).toBeInTheDocument();
  });

});


