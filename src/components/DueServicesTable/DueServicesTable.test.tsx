import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DueServicesTable from './DueServicesTable';
import MOCK_DUE_SERVICES from './MockDueServicesData';
import { DateTime } from 'luxon';
import DueService from '../../shared/DueService.model';
import ServiceStatus from '../../shared/ServiceStatus.model';


describe('<DueServicesTable />', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHandleUpdateService = jest.fn((updatedService: DueService) => { });

  it('it should mount', () => {
    render(<DueServicesTable dueServices={[]} handleUpdateService={mockHandleUpdateService} />);

    const dueServicesTable = screen.getByTestId('due-services-table');

    expect(dueServicesTable).toBeInTheDocument();
  });

  it('it should display due services', () => {

    // When: the Due Services Table is rendered with services 
    render(<DueServicesTable dueServices={MOCK_DUE_SERVICES} handleUpdateService={mockHandleUpdateService} />);

    // Then: All the rows should have the correct info
    const dueServicesTableRows = screen.getAllByTestId('due-service-table-row');
    expect(dueServicesTableRows.length).toBe(MOCK_DUE_SERVICES.length);
    dueServicesTableRows.forEach((row, index) => assertRowContent(row, MOCK_DUE_SERVICES[index]));

  });

  it('it should display message when there are no due services', () => {

    // When: the Due Services Table is rendered without any services 
    render(<DueServicesTable dueServices={[]} handleUpdateService={mockHandleUpdateService} />);

    // Then: The no services display message should be present
    const noDueServicesDisplay = screen.getByText('There are no due services at this time');
    expect(noDueServicesDisplay).toBeInTheDocument();

  });

  it('it should call handleUpdateService when new status is updated', () => {

    // Given: The table has service rows
    render(<DueServicesTable dueServices={MOCK_DUE_SERVICES} handleUpdateService={mockHandleUpdateService} />);
    const serviceToUpdate = MOCK_DUE_SERVICES[0];
    const newStatusDropdown = screen.getByDisplayValue(serviceToUpdate.currentStatus)
    const updateStatus = ServiceStatus.IN_PROGRESS;

    // When: the a service status is updated 
    fireEvent.change(newStatusDropdown, {
      target: { value: updateStatus }
    });

    // Then: the function to trigger the update should be called
    expect(mockHandleUpdateService).toBeCalledTimes(1);
    expect(mockHandleUpdateService).toBeCalledWith({ ...serviceToUpdate, prospectiveStatus: updateStatus });

  });

  const assertRowContent = (row: HTMLElement, service: DueService) => {

    const idColumn = row.getElementsByTagName('td')[0];
    expect(idColumn.textContent).toBe(service.id.toString());

    const clientColumn = row.getElementsByTagName('td')[1];
    expect(clientColumn.textContent).toBe(service.client.name);

    const frequencyColumn = row.getElementsByTagName('td')[2];
    expect(frequencyColumn.textContent).toBe(service.contract.serviceFrequency);

    const dueDateColumn = row.getElementsByTagName('td')[3];
    expect(dueDateColumn.textContent).toBe(service.dueDate.toLocaleString(DateTime.DATE_MED));

    const statusColumn = row.getElementsByTagName('td')[4];
    expect(statusColumn.textContent?.toLocaleLowerCase()).toBe(service.currentStatus.toLocaleLowerCase());

  }

});