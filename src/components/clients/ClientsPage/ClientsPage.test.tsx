import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ClientsPage from './ClientsPage';

describe('<ClientsPage />', () => {

  it('should display the clients page', () => {
    render(<ClientsPage/>);
    const clientsPage = screen.getByText(/Clients Page/);
    expect(clientsPage).toBeInTheDocument();
  });
  
});