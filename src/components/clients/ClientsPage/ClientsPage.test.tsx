import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ClientsPage from './ClientsPage';
import {fetchClientsWithContracts} from "../../../services/clients.services";
import MOCK_CLIENTS_WITH_CONTRACTS from "../../../shared/mockClientsWithContractsData";

jest.mock('../../../services/clients.services.ts');

describe('<ClientsPage />', () => {

  const mockFetchClientsWithContracts = fetchClientsWithContracts as jest.MockedFunction<typeof fetchClientsWithContracts>

  beforeEach(() => {
    mockFetchClientsWithContracts.mockResolvedValue(MOCK_CLIENTS_WITH_CONTRACTS)
  });

  it('should display the clients page', async () => {
    render(<ClientsPage/>);
    const clientsPage = screen.getByText(/Clients Page/);

    await waitFor(() => expect(clientsPage).toBeInTheDocument());
  });

  it('renders shows the loading component before the clients are fetched', async () => {
    render(<ClientsPage/>);
    const loadingComponent = screen.getByTestId('ClientsTable-Skeleton');

    await waitFor(() => expect(loadingComponent).toBeInTheDocument());
  });

  it('shows no clients if the fetch is empty', async () => {

    // Given: No due clients will be fetched
    mockFetchClientsWithContracts.mockResolvedValue([]);

    // When: The ClientsPage renders
    render(<ClientsPage/>);

    // Then: We expect no due services message to be displayed
    expect(fetchClientsWithContracts).toHaveBeenCalledTimes(1);
    await screen.findByText("There are no clients to display. Consider adding clients to the system.");

  });

  it('shows the clients after they are fetched', async () => {

    // When: The ClientsPage renders
    render(<ClientsPage/>);

    // Then: We expect the due services to be in the document
    expect(fetchClientsWithContracts).toHaveBeenCalledTimes(1);
    await screen.findByTestId("clients-table");

  });

  it('shows the error message when fetching clients fails', async () => {

    // Given: The clients failed to be fetched
    mockFetchClientsWithContracts.mockRejectedValue(new Error('Fetch clients did not work'));

    // When: The ClientsPage renders
    render(<ClientsPage/>);

    // Then: We expect the due services to be in the document
    expect(fetchClientsWithContracts).toHaveBeenCalledTimes(1);
    await screen.findByText("Sorry... we weren't able to get the clients at this time.");

  });

});