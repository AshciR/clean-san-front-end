import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import App from './App';
import {createMemoryRouter} from "react-router-dom";
import routerConfig from "./routerConfig";

describe('App', () => {

  it('renders the application', async () => {
    const router = createMemoryRouter(routerConfig);

    render(<App router={router}/>);

    const app = await screen.findByTestId('app');
    await waitFor(() => expect(app).toBeInTheDocument());
  });

  it('navigates between pages', async () => {

    // Given: the app loads
    const router = createMemoryRouter(routerConfig);
    render(<App router={router}/>);

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

    // Given: We have an invalid route
    const badRoute = '/not-a-valid-route';
    const router = createMemoryRouter(routerConfig, {
      initialEntries: [badRoute]
    });

    // When: The App is navigated to a non-existent page
    render(<App router={router}/>);

    // Then: The Not Found page should be displayed
    expect(screen.getByTestId('NotFoundPage')).toBeInTheDocument();
  });

});


