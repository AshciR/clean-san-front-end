import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ClientsTable from './ClientsTable';
import Client from "../../../shared/Client.model";
import {convertClientResponseToClientWithContracts} from "../../../services/clients.services";
import {getClientsResponse} from "../../../mocks/clientsEndpointResponses";
import {ClientsPageOrderByOptions, OrderByOptions, SortOrder} from "../ClientsPage/clientsPage.reducer";
import {ClientWithContracts} from "../../../shared/ClientWithContracts.model";

describe('<ClientsTable />', () => {

  const clientsWithContracts = getClientsResponse.clients.map(client =>
    convertClientResponseToClientWithContracts(client)
  )

  const SORT_BY_NAME_ASC: SortOrder = {
    orderBy: ClientsPageOrderByOptions.NAME,
    direction: OrderByOptions.ASC
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHandleOpenViewAssociatedContractsModal = jest.fn();
  const mockHandleChangePage = jest.fn();
  const mockHandleChangeRowsPerPage = jest.fn();
  const mockHandleSortBy = jest.fn();

  test('it should mount', () => {
    render(<ClientsTable
      clients={[]}
      totalClients={0}
      clientsPerPage={25}
      currentPage={0}
      handleChangePage={mockHandleChangePage}
      handleChangeRowsPerPage={mockHandleChangeRowsPerPage}
      handleOpenViewAssociatedContractsModal={mockHandleOpenViewAssociatedContractsModal}
      sortOrder={SORT_BY_NAME_ASC}
      handleSortBy={mockHandleSortBy}
    />);

    const clientsTable = screen.getByTestId('clients-table');

    expect(clientsTable).toBeInTheDocument();
  });

  it('should display clients', () => {

    // When: the Due Services Table is rendered with services
    render(<ClientsTable
      clients={clientsWithContracts}
      totalClients={clientsWithContracts.length}
      clientsPerPage={25}
      currentPage={0}
      handleChangePage={mockHandleChangePage}
      handleChangeRowsPerPage={mockHandleChangeRowsPerPage}
      handleOpenViewAssociatedContractsModal={mockHandleOpenViewAssociatedContractsModal}
      sortOrder={SORT_BY_NAME_ASC}
      handleSortBy={mockHandleSortBy}
    />);

    // Then: All the rows should have the correct info
    const clientTableRows = screen.getAllByTestId('client-table-row');
    expect(clientTableRows.length).toBe(clientsWithContracts.length);
    clientTableRows.forEach((row, index) => assertRowContent(row, clientsWithContracts[index]));

  });

  it('should display message when there are no clients', () => {

    // When: the Due Services Table is rendered without any services
    render(<ClientsTable
      clients={[]}
      totalClients={0}
      clientsPerPage={25}
      currentPage={0}
      handleChangePage={mockHandleChangePage}
      handleChangeRowsPerPage={mockHandleChangeRowsPerPage}
      handleOpenViewAssociatedContractsModal={mockHandleOpenViewAssociatedContractsModal}
      sortOrder={SORT_BY_NAME_ASC}
      handleSortBy={mockHandleSortBy}
    />);

    // Then: The no services display message should be present
    const noClientsDisplay = screen.getByText('There are no clients to display. Add clients with the "Add Clients" Button.');
    expect(noClientsDisplay).toBeInTheDocument();

  });

  it('should call mockHandleOpenViewAssociatedContractsModal when client id is clicked', () => {

    // Given: The table has client rows
    render(<ClientsTable
      clients={clientsWithContracts}
      totalClients={clientsWithContracts.length}
      clientsPerPage={25}
      currentPage={0}
      handleChangePage={mockHandleChangePage}
      handleChangeRowsPerPage={mockHandleChangeRowsPerPage}
      handleOpenViewAssociatedContractsModal={mockHandleOpenViewAssociatedContractsModal}
      sortOrder={SORT_BY_NAME_ASC}
      handleSortBy={mockHandleSortBy}
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

  it('should sort the table when column is selected', () => {

    // Given: We have a table
    render(<ClientsTable
      clients={clientsWithContracts}
      totalClients={clientsWithContracts.length}
      clientsPerPage={25}
      currentPage={0}
      handleChangePage={mockHandleChangePage}
      handleChangeRowsPerPage={mockHandleChangeRowsPerPage}
      handleOpenViewAssociatedContractsModal={mockHandleOpenViewAssociatedContractsModal}
      sortOrder={SORT_BY_NAME_ASC}
      handleSortBy={mockHandleSortBy}
    />);

    const clientSortButton = screen.getAllByTestId('ArrowDownwardIcon')[0];

    // When: the client sort is clicked
    fireEvent.click(clientSortButton);

    // Then: the table should be sorted by column
    expect(mockHandleSortBy).toBeCalledTimes(1);
    expect(mockHandleSortBy).toBeCalledWith(ClientsPageOrderByOptions.NAME);

  });

  const assertRowContent = (row: HTMLElement, client: ClientWithContracts) => {
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