import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ClientsTable from './ClientsTable';
import Client from "../../../shared/Client.model";
import {convertClientResponseToClientWithContracts} from "../../../services/clients.services";
import {getClientsResponse} from "../../../mocks/clientsEndpointResponses";

describe('<ClientsTable />', () => {

  const clientsWithContracts = getClientsResponse.clients.map(client =>
    convertClientResponseToClientWithContracts(client)
  )

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHandleOpenViewAssociatedContractsModal = jest.fn();

  test('it should mount', () => {
    render(<ClientsTable
      clients={[]}
      handleOpenViewAssociatedContractsModal={mockHandleOpenViewAssociatedContractsModal}
    />);

    const clientsTable = screen.getByTestId('clients-table');

    expect(clientsTable).toBeInTheDocument();
  });

  it('should display clients', () => {

    // When: the Due Services Table is rendered with services
    render(<ClientsTable
      clients={clientsWithContracts}
      handleOpenViewAssociatedContractsModal={mockHandleOpenViewAssociatedContractsModal}
    />);

    // Then: All the rows should have the correct info
    const clientTableRows = screen.getAllByTestId('client-table-row');
    expect(clientTableRows.length).toBe(clientsWithContracts.length);
    clientTableRows.forEach((row, index) => assertRowContent(row, clientsWithContracts[index]));

  });

  it('should display message when there are no due services', () => {

    // When: the Due Services Table is rendered without any services
    render(<ClientsTable
      clients={[]}
      handleOpenViewAssociatedContractsModal={mockHandleOpenViewAssociatedContractsModal}
    />);

    // Then: The no services display message should be present
    const noClientsDisplay = screen.getByText('There are no clients to display. Consider adding clients to the system.');
    expect(noClientsDisplay).toBeInTheDocument();

  });

  it('should call mockHandleOpenViewAssociatedContractsModal when client id is clicked', () => {

    // Given: The table has client rows
    render(<ClientsTable
      clients={clientsWithContracts}
      handleOpenViewAssociatedContractsModal={mockHandleOpenViewAssociatedContractsModal}
    />);
    const clientOfInterest = clientsWithContracts[0];
    const clientButton = screen.getByRole('button', {name: `${clientOfInterest.id}`})

    // When: the client id is clicked
    fireEvent.click(clientButton);

    // Then: the function to open the modal should be called
    expect(mockHandleOpenViewAssociatedContractsModal).toBeCalledTimes(1);
    // Should be called with the client that was clicked
    expect(mockHandleOpenViewAssociatedContractsModal).toBeCalledWith(clientOfInterest);

  });

  const assertRowContent = (row: HTMLElement, client: Client) => {
    const idColumn = row.getElementsByTagName('td')[0];
    expect(idColumn.textContent).toBe(client.id.toString());

    const nameColumn = row.getElementsByTagName('td')[1];
    expect(nameColumn.textContent).toBe(client.name);

    const emailColumn = row.getElementsByTagName('td')[2];
    expect(emailColumn.textContent).toBe(client.email);

    const activeColumn = row.getElementsByTagName('td')[3];
    expect(activeColumn.textContent).toBe(client.isActive ? 'Active' : 'Inactive');
  }

});