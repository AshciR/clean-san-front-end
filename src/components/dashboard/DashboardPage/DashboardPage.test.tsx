import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DashboardPage from './DashboardPage';
import MOCK_DUE_SERVICES from '../../../shared/mockDueServicesData';
import {fetchDueServices, submitUpdatedServices} from '../../../services/services.services';
import {DateTime} from 'luxon';
import ServiceStatus from '../../../shared/ServiceStatus.model';

jest.mock('../../../services/services.services.ts');

describe('<DashboardPage />', () => {

  const mockFetchDueServices = fetchDueServices as jest.MockedFunction<typeof fetchDueServices>
  const mockSubmitUpdatedServices = submitUpdatedServices as jest.MockedFunction<typeof submitUpdatedServices>

  beforeEach(() => {
    mockFetchDueServices.mockResolvedValue(MOCK_DUE_SERVICES);
  });

  test('it should mount', async () => {
    render(<DashboardPage/>);
    const dashboardPage = await screen.findByTestId('DashboardPage');

    await waitFor(() => expect(dashboardPage).toBeInTheDocument());
  });

  it('renders shows the loading component before the due services are fetched', async () => {
    render(<DashboardPage/>);
    const loadingComponent = await screen.findByTestId('DueServicesTable-Skeleton');

    await waitFor(() => expect(loadingComponent).toBeInTheDocument());
  });

  it('shows no services if the fetch is empty', async () => {

    // Given: No due services will be fetched
    mockFetchDueServices.mockResolvedValue([]);

    // When: The DashboardPage renders
    render(<DashboardPage/>);

    // Then: We expect no due services message to be displayed
    expect(fetchDueServices).toHaveBeenCalledTimes(1);
    await screen.findByText("There are no due services at this time");

  });

  it('shows the due services after they are fetched', async () => {

    // When: The DashboardPage renders
    render(<DashboardPage/>);

    // Then: We expect the due services to be in the document
    expect(fetchDueServices).toHaveBeenCalledTimes(1);
    await screen.findByTestId("due-services-table");

  });

  it('shows the error message when fetching due services fails', async () => {

    // Given: The services failed to be fetched
    mockFetchDueServices.mockRejectedValue(new Error('Fetch due services did not work'));

    // When: The DashboardPage renders
    render(<DashboardPage/>);

    // Then: We expect the due services to be in the document
    expect(fetchDueServices).toHaveBeenCalledTimes(1);
    await screen.findByText("Sorry... we weren't able to get the due services at this time.");

  });

  it('shows the current date when the page loads', async () => {

    // When: The DashboardPage renders
    render(<DashboardPage/>);

    // Then: We expect the current date to be in the date selector
    const today = DateTime.now().setLocale('en-GB').toLocaleString();
    const datePicker = await screen.findByDisplayValue(today)
    await waitFor(() => expect(datePicker).toBeInTheDocument());
  });

  it('should update the service status correctly', async () => {

    // Given: The DashboardPage renders with services
    render(<DashboardPage/>);

    const serviceToUpdate = MOCK_DUE_SERVICES[0];
    const newStatusDropdown = await screen.findByDisplayValue(serviceToUpdate.currentStatus);
    const newStatus = ServiceStatus.IN_PROGRESS;

    // When: The service status is changed

    fireEvent.change(newStatusDropdown, {
      target: {value: newStatus}
    })


    // Then: We expect no due services message to be displayed
    await waitFor(() => expect(newStatusDropdown).toHaveValue(newStatus));

  });

  it('the change statuses button should be disabled when the page loads', async () => {

    // When: The DashboardPage renders
    render(<DashboardPage/>);

    // Then: We expect the change status button to be disabled
    const changeStatusButton = await screen.findByRole('button', {name: 'Change Statuses'});
    await waitFor(() => expect(changeStatusButton).toBeDisabled());
  });

  it('the change statuses button should be enabled when status changes', async () => {

    // Given: The DashboardPage renders with services
    render(<DashboardPage/>);

    const serviceToUpdate = MOCK_DUE_SERVICES[0];
    const newStatusDropdown = await screen.findByDisplayValue(serviceToUpdate.currentStatus);
    const newStatus = ServiceStatus.IN_PROGRESS;

    // When: The service status is changed

    fireEvent.change(newStatusDropdown, {
      target: {value: newStatus}
    });


    // Then: We expect the change statuses button to be enabled
    await waitFor(() => expect(screen.getByRole('button', {name: 'Change Statuses'})).toBeEnabled());

  });

  it('successful update notification is displayed is called after submit button is clicked', async () => {

    // Given: The DashboardPage renders with services
    render(<DashboardPage/>);

    const serviceToUpdate = MOCK_DUE_SERVICES[0];
    const newStatusDropdown = await screen.findByDisplayValue(serviceToUpdate.currentStatus);
    const newStatus = ServiceStatus.IN_PROGRESS;

    // And: The service status is changed

    fireEvent.change(newStatusDropdown, {
      target: {value: newStatus}
    });


    const updatedService = {...MOCK_DUE_SERVICES[0], currentStatus: newStatus};
    mockSubmitUpdatedServices.mockResolvedValue([updatedService]);

    // When: The changes are submitted
    const submitButton = await screen.findByRole('button', {name: 'Change Statuses'});
    await waitFor(() => submitButton.click());

    // Then: We expect the submitUpdatedServices to be called
    expect(submitUpdatedServices).toHaveBeenCalledTimes(1);

    // And: The notification was displayed
    const snackBarNotification = await screen.findByText('Services were updated');
    expect(snackBarNotification).toBeInTheDocument();
    expect(snackBarNotification.textContent).toBe('Services were updated');

  });

  it('unsuccessful update notification is displayed is called after submit button is clicked', async () => {

    // Given: The DashboardPage renders with services
    render(<DashboardPage/>);

    const serviceToUpdate = MOCK_DUE_SERVICES[0];
    const newStatusDropdown = await screen.findByDisplayValue(serviceToUpdate.currentStatus);
    const newStatus = ServiceStatus.IN_PROGRESS;

    // And: The service status is changed

    fireEvent.change(newStatusDropdown, {
      target: {value: newStatus}
    });


    mockSubmitUpdatedServices.mockRejectedValue([]); // Failed service update

    // When: The changes are submitted
    const submitButton = await screen.findByRole('button', {name: 'Change Statuses'});
    await waitFor(() => submitButton.click());

    // Then: We expect the submitUpdatedServices to be called
    expect(submitUpdatedServices).toHaveBeenCalledTimes(1);

    // And: The notification was displayed
    const snackBarNotification = await screen.findByText('There was an error updating the services. Please try again later.');
    expect(snackBarNotification).toBeInTheDocument();
    expect(snackBarNotification.textContent).toBe('There was an error updating the services. Please try again later.');

  });

});