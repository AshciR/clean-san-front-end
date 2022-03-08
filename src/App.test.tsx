import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';


describe('App', () => {

  it('renders the application', () => {
    render(<App />);
    const app = screen.getByTestId('app');
    expect(app).toBeInTheDocument();
  });

});


