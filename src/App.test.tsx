import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import App from './App';
import {MemoryRouter} from "react-router-dom";


describe('App', () => {

  it('renders the application', async () => {
    render(<App/>, {wrapper: MemoryRouter});
    const app = await screen.findByTestId('app');
    await waitFor(() => expect(app).toBeInTheDocument());
  });

  it('navigates between pages', async () => {

    // Given: the app loads
    render(<App/>, {wrapper: MemoryRouter});

    // When: we navigate to the Clients page
    const menuButton = await screen.findByLabelText('menu');
    fireEvent.click(menuButton);

    const clientsButton = await screen.findByRole('link', {
      name: /Clients/
    });
    fireEvent.click(clientsButton);

    // Then: we should be routed correctly
    const clientsPageContent = await screen.findAllByText('Clients')
    expect(clientsPageContent[1]).toBeInTheDocument();

  });

  it('navigates to the Not Found Page', () => {

    // When: The App is navigated to a non-existent page
    const badRoute = '/not-a-valid-route';
    render(
      <MemoryRouter initialEntries={[badRoute]}>
        <App/>
      </MemoryRouter>,
    );

    // Then: The Not Found page should be displayed
    expect(screen.getByTestId('NotFoundPage')).toBeInTheDocument();
  });

});


