import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DueServicesTable from './DueServicesTable';
import MOCK_DUE_SERVICES from './MockDueServicesData';
import { DateTime } from 'luxon';
import DueService from '../../shared/DueService.model';

describe('<DueServicesTable />', () => {

  it('it should mount', () => {
    render(<DueServicesTable dueServices={[]} />);

    const dueServicesTable = screen.getByTestId('due-services-table');

    expect(dueServicesTable).toBeInTheDocument();
  });

  it('it should display due services', () => {

    // When: the Due Services Table is rendered with services 
    render(<DueServicesTable dueServices={MOCK_DUE_SERVICES} />);

    // Then: ALl the rows should have the correct info
    const dueServicesTableRows = screen.getAllByTestId('due-service-table-row');
    expect(dueServicesTableRows.length).toBe(MOCK_DUE_SERVICES.length);
    dueServicesTableRows.forEach((row, index) => assertRowContent(row, MOCK_DUE_SERVICES[index]));

  });

  const assertRowContent = (row: HTMLElement, service: DueService) => {

    const firstRowIdColumn = row.getElementsByTagName('td')[0];
    expect(firstRowIdColumn.textContent).toBe(service.id.toString());

    const firstRowClientColumn = row.getElementsByTagName('td')[1];
    expect(firstRowClientColumn.textContent).toBe(service.client.name);

    const firstRosFrequencyColumn = row.getElementsByTagName('td')[2];
    expect(firstRosFrequencyColumn.textContent).toBe(service.contract.serviceFrequency);

    const firstRowDueDateColumn = row.getElementsByTagName('td')[3];
    expect(firstRowDueDateColumn.textContent).toBe(service.dueDate.toLocaleString(DateTime.DATE_MED));

    const firstRowStatusColumn = row.getElementsByTagName('td')[4];
    expect(firstRowStatusColumn.textContent).toBe(service.currentStatus);

  }

});