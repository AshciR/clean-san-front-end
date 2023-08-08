import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DueServicesTable from './DueServicesTable';
import {DateTime} from 'luxon';
import DueService from '../../../shared/DueService.model';
import ServiceStatus from '../../../shared/ServiceStatus.model';
import {getDueServicesResponse} from "../../../mocks/servicesEndpointResponses";
import {convertServicesQueryResponseToDueService} from "../../../services/services.services";
import {DashboardOrderByOptions, OrderByOptions, SortOrder} from "../DashboardPage/dashboardPage.reducer";


describe('<DueServicesTable />', () => {

  const MOCK_DUE_SERVICES = getDueServicesResponse.services.map(service =>
    convertServicesQueryResponseToDueService(service)
  );

  const SORT_BY_CLIENT_ASC: SortOrder = {
    orderBy: DashboardOrderByOptions.CLIENT,
    direction: OrderByOptions.ASC
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHandleUpdateService = jest.fn();
  const mockHandleOpenViewAssociatedServicesModal = jest.fn();
  const mockHandleChangePage = jest.fn();
  const mockHandleChangeRowsPerPage = jest.fn();
  const mockHandleSortBy = jest.fn();

  it('should mount', () => {
    render(<DueServicesTable
      dueServices={[]}
      totalServices={200}
      servicesPerPage={50}
      currentPage={0}
      handleUpdateService={mockHandleUpdateService}
      handleOpenViewAssociatedServicesModal={mockHandleOpenViewAssociatedServicesModal}
      handleChangePage={mockHandleChangePage}
      handleChangeRowsPerPage={mockHandleChangeRowsPerPage}
      sortOrder={SORT_BY_CLIENT_ASC}
      handleSortBy={mockHandleSortBy}
    />);

    const dueServicesTable = screen.getByTestId('due-services-table');

    expect(dueServicesTable).toBeInTheDocument();
  });

  it('should display due services', () => {

    // When: the Due Services Table is rendered with services
    render(<DueServicesTable
      dueServices={MOCK_DUE_SERVICES}
      totalServices={200}
      servicesPerPage={50}
      currentPage={0}
      handleUpdateService={mockHandleUpdateService}
      handleOpenViewAssociatedServicesModal={mockHandleOpenViewAssociatedServicesModal}
      handleChangePage={mockHandleChangePage}
      handleChangeRowsPerPage={mockHandleChangeRowsPerPage}
      sortOrder={SORT_BY_CLIENT_ASC}
      handleSortBy={mockHandleSortBy}
    />);

    // Then: All the rows should have the correct info
    const dueServicesTableRows = screen.getAllByTestId('due-service-table-row');
    expect(dueServicesTableRows.length).toBe(MOCK_DUE_SERVICES.length);
    dueServicesTableRows.forEach((row, index) => assertRowContent(row, MOCK_DUE_SERVICES[index]));

  });

  it('should display message when there are no due services', () => {

    // When: the Due Services Table is rendered without any services 
    render(<DueServicesTable
      dueServices={[]}
      totalServices={200}
      servicesPerPage={50}
      currentPage={0}
      handleUpdateService={mockHandleUpdateService}
      handleOpenViewAssociatedServicesModal={mockHandleOpenViewAssociatedServicesModal}
      handleChangePage={mockHandleChangePage}
      handleChangeRowsPerPage={mockHandleChangeRowsPerPage}
      sortOrder={SORT_BY_CLIENT_ASC}
      handleSortBy={mockHandleSortBy}
    />);

    // Then: The no services display message should be present
    const noDueServicesDisplay = screen.getByText('There are no due services at this time');
    expect(noDueServicesDisplay).toBeInTheDocument();

  });

  it('should call handleUpdateService when new status is updated', () => {

    // Given: The table has service rows
    render(<DueServicesTable
      dueServices={MOCK_DUE_SERVICES}
      totalServices={200}
      servicesPerPage={50}
      currentPage={0}
      handleUpdateService={mockHandleUpdateService}
      handleOpenViewAssociatedServicesModal={mockHandleOpenViewAssociatedServicesModal}
      handleChangePage={mockHandleChangePage}
      handleChangeRowsPerPage={mockHandleChangeRowsPerPage}
      sortOrder={SORT_BY_CLIENT_ASC}
      handleSortBy={mockHandleSortBy}
    />);
    const serviceToUpdate = MOCK_DUE_SERVICES[0];
    const newStatusDropdown = screen.getAllByDisplayValue(serviceToUpdate.currentStatus)[0]
    const updateStatus = ServiceStatus.IN_PROGRESS;

    // When: the service status is updated
    fireEvent.change(newStatusDropdown, {
      target: {value: updateStatus}
    });

    // Then: the function to trigger the update should be called
    expect(mockHandleUpdateService).toBeCalledTimes(1);
    expect(mockHandleUpdateService).toBeCalledWith({...serviceToUpdate, prospectiveStatus: updateStatus});

  });

  it('should call handleOpenViewAssociatedServicesModal when service id is clicked', () => {

    // Given: The table has service rows
    const dueServices = getDueServicesResponse.services.map(service =>
      convertServicesQueryResponseToDueService(service)
    );
    render(<DueServicesTable
      dueServices={MOCK_DUE_SERVICES}
      totalServices={200}
      servicesPerPage={50}
      currentPage={0}
      handleUpdateService={mockHandleUpdateService}
      handleOpenViewAssociatedServicesModal={mockHandleOpenViewAssociatedServicesModal}
      handleChangePage={mockHandleChangePage}
      handleChangeRowsPerPage={mockHandleChangeRowsPerPage}
      sortOrder={SORT_BY_CLIENT_ASC}
      handleSortBy={mockHandleSortBy}
    />);
    const serviceOfInterest = dueServices[3]; // service id: 4, contract id: 1
    const serviceButton = screen.getByRole('button', {name: `${serviceOfInterest.id}`})

    // When: the service id is clicked
    fireEvent.click(serviceButton);

    // Then: the function to trigger the update should be called
    expect(mockHandleOpenViewAssociatedServicesModal).toBeCalledTimes(1);
    // Should be called with the contract id for the service
    expect(mockHandleOpenViewAssociatedServicesModal).toBeCalledWith(serviceOfInterest);

  });

  it('should change the page when the next page button is clicked', () => {

    // Given: The table is on page 0
    const currentPage = 0;
    render(<DueServicesTable
      dueServices={MOCK_DUE_SERVICES}
      totalServices={200}
      servicesPerPage={50}
      currentPage={currentPage}
      handleUpdateService={mockHandleUpdateService}
      handleOpenViewAssociatedServicesModal={mockHandleOpenViewAssociatedServicesModal}
      handleChangePage={mockHandleChangePage}
      handleChangeRowsPerPage={mockHandleChangeRowsPerPage}
      sortOrder={SORT_BY_CLIENT_ASC}
      handleSortBy={mockHandleSortBy}
    />);

    const nextPageButton = screen.getByRole('button', {name: 'Go to next page'});

    // When: the next page button is clicked
    fireEvent.click(nextPageButton);

    // Then: the table should fetch the paginated response of the next page
    expect(mockHandleChangePage).toBeCalledTimes(1);
    const nextPage = currentPage + 1;
    expect(mockHandleChangePage).toBeCalledWith(nextPage);

  });

  it('should change the page when the previous page button is clicked', () => {

    // Given: The table is on page 1
    const currentPage = 1;
    render(<DueServicesTable
      dueServices={MOCK_DUE_SERVICES}
      totalServices={200}
      servicesPerPage={50}
      currentPage={currentPage}
      handleUpdateService={mockHandleUpdateService}
      handleOpenViewAssociatedServicesModal={mockHandleOpenViewAssociatedServicesModal}
      handleChangePage={mockHandleChangePage}
      handleChangeRowsPerPage={mockHandleChangeRowsPerPage}
      sortOrder={SORT_BY_CLIENT_ASC}
      handleSortBy={mockHandleSortBy}
    />);

    const previousPageButton = screen.getByRole('button', {name: 'Go to previous page'});

    // When: the previous page button is clicked
    fireEvent.click(previousPageButton);

    // Then: the table should fetch the paginated response of the next page
    expect(mockHandleChangePage).toBeCalledTimes(1);
    const previousPage = currentPage - 1;
    expect(mockHandleChangePage).toBeCalledWith(previousPage);

  });

  const assertRowContent = (row: HTMLElement, service: DueService) => {

    const idColumn = row.getElementsByTagName('td')[0];
    expect(idColumn.textContent).toBe(service.id.toString());

    const clientColumn = row.getElementsByTagName('td')[1];
    expect(clientColumn.textContent).toBe(service.client.name);

    const frequencyColumn = row.getElementsByTagName('td')[2];
    expect(frequencyColumn.textContent?.toLocaleUpperCase()).toBe(service.contract.serviceFrequency.toLocaleUpperCase());

    const dueDateColumn = row.getElementsByTagName('td')[3];
    expect(dueDateColumn.textContent).toBe(service.dueDate.toLocaleString(DateTime.DATE_MED));

    const statusColumn = row.getElementsByTagName('td')[4];
    expect(statusColumn.textContent?.toLocaleUpperCase().replace(' ', '_')).toBe(service.currentStatus.toLocaleUpperCase());

  }

});