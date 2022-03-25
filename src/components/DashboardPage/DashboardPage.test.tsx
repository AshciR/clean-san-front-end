import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DashboardPage from './DashboardPage';
import MOCK_DUE_SERVICES from '../DueServicesTable/MockDueServicesData';
import { fetchDueServices } from './dashboardPage.services';
import { DateTime } from 'luxon';

jest.mock('./dashboardPage.services');

describe('<DashboardPage />', () => {

  const mockFetchDueServices = fetchDueServices as jest.MockedFunction<typeof fetchDueServices>

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

});