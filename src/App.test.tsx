import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import App from './App';


describe('App', () => {

  it('renders the application', async () => {
    render(<App/>);
    const app = await screen.findByTestId('app');
    await waitFor(() => expect(app).toBeInTheDocument());
  });

});


