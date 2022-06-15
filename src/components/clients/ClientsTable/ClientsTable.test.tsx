import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ClientsTable from './ClientsTable';
import MOCK_CLIENTS_WITH_CONTRACTS from "../../../shared/mockClientsWithContractsData";
import Client from "../../../shared/Client.model";

describe('<ClientsTable />', () => {
  test('it should mount', () => {
    render(<ClientsTable clients={[]}/>);

    const clientsTable = screen.getByTestId('clients-table');

    expect(clientsTable).toBeInTheDocument();
  });

  it('should display clients', () => {

    // When: the Due Services Table is rendered with services
    render(<ClientsTable clients={MOCK_CLIENTS_WITH_CONTRACTS}/>);

    // Then: All the rows should have the correct info
    const clientTableRows = screen.getAllByTestId('client-table-row');
    expect(clientTableRows.length).toBe(MOCK_CLIENTS_WITH_CONTRACTS.length);
    clientTableRows.forEach((row, index) => assertRowContent(row, MOCK_CLIENTS_WITH_CONTRACTS[index]));

  });

  it('should display message when there are no due services', () => {

    // When: the Due Services Table is rendered without any services
    render(<ClientsTable clients={[]}/>);

    // Then: The no services display message should be present
    const noClientsDisplay = screen.getByText('There are no clients to display. Consider adding clients to the system.');
    expect(noClientsDisplay).toBeInTheDocument();

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