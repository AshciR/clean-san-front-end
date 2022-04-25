import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DashboardPage from './DashboardPage';
import MOCK_DUE_SERVICES from '../DueServicesTable/MockDueServicesData';
import { fetchDueServices, submitUpdatedServices } from './dashboardPage.services';
import { DateTime } from 'luxon';
import ServiceStatus from '../../shared/ServiceStatus.model';

jest.mock('./dashboardPage.services');

describe('<DashboardPage />', () => {

  const mockFetchDueServices = fetchDueServices as jest.MockedFunction<typeof fetchDueServices>
  const mockSubmitUpdatedServices = submitUpdatedServices as jest.MockedFunction<typeof submitUpdatedServices>

  beforeEach(() => {
    mockFetchDueServices.mockResolvedValue(MOCK_DUE_SERVICES);
  });

  test('it should mount', async () => {
    render(<DashboardPage />);
    const dashboardPage = screen.getByTestId('DashboardPage');

    await waitFor(() => expect(dashboardPage).toBeInTheDocument());
  });

  it('renders shows the loading component before the due services are fetched', async () => {
    render(<DashboardPage />);
    const loadingComponent = screen.getByTestId('DueServicesTable-Skeleton');

    await waitFor(() => expect(loadingComponent).toBeInTheDocument());
  });

  it('it shows no services if the fetch is empty', async () => {

    // Given: No due services will be fetched
    mockFetchDueServices.mockResolvedValue([]);

    // When: The DashboardPage renders
    render(<DashboardPage />);

    // Then: We expect no due services message to be displayed
    expect(fetchDueServices).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByText("There are no due services at this time")).toBeInTheDocument());

  });

  it('it shows the due services after they are fetched', async () => {

    // When: The DashboardPage renders
    render(<DashboardPage />);

    // Then: We expect the due services to be in the document
    expect(fetchDueServices).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByTestId("due-services-table")).toBeInTheDocument());

  });

  it('it shows the error message when fetching due services fails', async () => {

    // Given: The services failed to be fetched
    mockFetchDueServices.mockRejectedValue(new Error('Fetch due services did not work'));

    // When: The DashboardPage renders
    render(<DashboardPage />);

    // Then: We expect the due services to be in the document
    expect(fetchDueServices).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByText("Sorry... we weren't able to get the due services at this time.")).toBeInTheDocument());

  });

  it('it shows the current date when the page loads', async () => {

    // When: The DashboardPage renders
    render(<DashboardPage />);

    // Then: We expect the current date to be in the date selector
    const today = DateTime.now().toLocaleString();
    await waitFor(() => expect(screen.getByDisplayValue(today)).toBeInTheDocument());
  });

  it('it should update the service status correctly', async () => {

    // Given: The DashboardPage renders with services
    render(<DashboardPage />);

    const serviceToUpdate = MOCK_DUE_SERVICES[0];
    const newStatusDropdown = await screen.findByDisplayValue(serviceToUpdate.currentStatus);
    const newStatus = ServiceStatus.IN_PROGRESS;

    // When: The service status is changed
    await waitFor(() =>
      fireEvent.change(newStatusDropdown, {
        target: { value: newStatus }
      })
    );

    // Then: We expect no due services message to be displayed
    await waitFor(() => expect(newStatusDropdown).toHaveValue(newStatus));

  });

  it('the change statuses button should be disabled when the page loads', async () => {

    // When: The DashboardPage renders
    render(<DashboardPage />);

    // Then: We expect the change status button to be disabled
    await waitFor(() => expect(screen.getByRole('button', { name: 'Change Statuses' })).toBeDisabled());
  });

  it('the change statuses button should be enabled when status changes', async () => {

    // Given: The DashboardPage renders with services
    render(<DashboardPage />);

    const serviceToUpdate = MOCK_DUE_SERVICES[0];
    const newStatusDropdown = await screen.findByDisplayValue(serviceToUpdate.currentStatus);
    const newStatus = ServiceStatus.IN_PROGRESS;

    // When: The service status is changed
    await waitFor(() =>
      fireEvent.change(newStatusDropdown, {
        target: { value: newStatus }
      })
    );

    // Then: We expect the change statuses button to be enabled
    await waitFor(() => expect(screen.getByRole('button', { name: 'Change Statuses' })).toBeEnabled());

  });

  it('the fetchDueServices and submitUpdatedServices are called after submit button is clicked', async () => {

    // Given: The DashboardPage renders with services
    render(<DashboardPage />);

    const serviceToUpdate = MOCK_DUE_SERVICES[0];
    const newStatusDropdown = await screen.findByDisplayValue(serviceToUpdate.currentStatus);
    const newStatus = ServiceStatus.IN_PROGRESS;

    // And: The service status is changed
    await waitFor(() =>
      fireEvent.change(newStatusDropdown, {
        target: { value: newStatus }
      })
    );

    // When: The changes are submitted
    const submitButton = await screen.findByRole('button', { name: 'Change Statuses' });
    await waitFor(() => submitButton.click());

    const updatedService = { ...MOCK_DUE_SERVICES[0], currentStatus: newStatus };
    mockSubmitUpdatedServices.mockResolvedValue([updatedService]);

    // Then: We expect the fetchDueServices and submitUpdatedServices to be called
    expect(fetchDueServices).toHaveBeenCalledTimes(2);
    expect(submitUpdatedServices).toHaveBeenCalledTimes(1);

  });
});