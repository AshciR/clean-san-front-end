import DueService from "../../../shared/DueService.model";
import ServiceStatus from "../../../shared/ServiceStatus.model";
import MOCK_DUE_SERVICES from "../../../shared/mockDueServicesData";
import dueServicesReducer, {
  convertSortOrderToQueryParam,
  DashboardAction,
  DashboardOrderByOptions,
  defaultSortOrder,
  DueServicesState,
  initialDueServicesState,
  ITEMS_PER_PAGE_OPTIONS,
  OrderByOptions,
  SortOrder
} from "./dashboardPage.reducer";

describe('DashboardPage Reducer', () => {

  test('init fetching due services', () => {

    // Given: We have a current state and an action
    const state = initialDueServicesState
    const action: DashboardAction = {
      type: 'DUE_SERVICES_FETCH_INIT'
    };

    // When: We call the reducer
    const updatedState = dueServicesReducer(state, action);

    // Then: The expected state should be produced
    const expectedState: DueServicesState = {
      dueServices: [],
      isLoading: true,
      isFetchError: false,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: defaultSortOrder
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  test('fetches due services successfully from initial state', () => {

    // Given: We have a current state and an action
    const state = initialDueServicesState
    const action: DashboardAction = {
      type: 'DUE_SERVICES_FETCH_SUCCESS',
      payload: MOCK_DUE_SERVICES
    };

    // When: We call the reducer
    const updatedState = dueServicesReducer(state, action);

    // Then: The expected state should be produced
    const expectedState: DueServicesState = {
      dueServices: MOCK_DUE_SERVICES,
      isLoading: false,
      isFetchError: false,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: defaultSortOrder
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  test('fails to fetch due services from initial state', () => {

    // Given: We have a current state and an action
    const state = initialDueServicesState
    const action: DashboardAction = {
      type: 'DUE_SERVICES_FETCH_FAILURE'
    };

    // When: We call the reducer
    const updatedState = dueServicesReducer(state, action);

    // Then: The expected state should be produced
    const expectedState: DueServicesState = {
      dueServices: [],
      isLoading: false,
      isFetchError: true,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: defaultSortOrder
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  test('clears existing due services when it fails to fetch due services', () => {

    // Given: We have previously successfully fetched due services
    const state = initialDueServicesState
    const successAction: DashboardAction = {
      type: 'DUE_SERVICES_FETCH_SUCCESS',
      payload: MOCK_DUE_SERVICES
    };

    const stateWithDueServices = dueServicesReducer(state, successAction);

    // When: We fail the second fetch call
    const failAction: DashboardAction = {
      type: 'DUE_SERVICES_FETCH_FAILURE'
    };
    const updatedState = dueServicesReducer(stateWithDueServices, failAction);

    // Then: The expected state should be produced
    const expectedState: DueServicesState = {
      dueServices: [],
      isLoading: false,
      isFetchError: true,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: defaultSortOrder
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  test('should update the new status of the service', () => {

    // Given: We have due services
    const currentState: DueServicesState = {
      dueServices: MOCK_DUE_SERVICES,
      isLoading: false,
      isFetchError: false,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: defaultSortOrder
    };

    // And: We have the service we want to update
    const updatedService: DueService = {
      ...MOCK_DUE_SERVICES[0],
      prospectiveStatus: ServiceStatus.IN_PROGRESS
    }

    const updateAction: DashboardAction = {
      type: 'DUE_SERVICES_UPDATE_SERVICE',
      payload: updatedService
    };

    // When: We call the update action
    const updatedState = dueServicesReducer(currentState, updateAction);

    // Then: The expected state should be produced
    const expectedState: DueServicesState = {
      dueServices: [updatedService, ...MOCK_DUE_SERVICES.slice(1)],
      isLoading: false,
      isFetchError: false,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: defaultSortOrder
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  test('should update the new status of the service while preserving the order', () => {

    // Given: We have due services
    const currentState: DueServicesState = {
      dueServices: MOCK_DUE_SERVICES,
      isLoading: false,
      isFetchError: false,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: defaultSortOrder
    };

    // And: We want to update the 3rd service
    const updatedServiceIndex = 1;
    const updatedService: DueService = {
      ...MOCK_DUE_SERVICES[updatedServiceIndex],
      prospectiveStatus: ServiceStatus.IN_PROGRESS
    }

    const updateAction: DashboardAction = {
      type: 'DUE_SERVICES_UPDATE_SERVICE',
      payload: updatedService
    };

    // When: We call the update action
    const updatedState = dueServicesReducer(currentState, updateAction);

    // Then: The expected state should be produced
    const expectedState: DueServicesState = {
      dueServices: [
        ...MOCK_DUE_SERVICES.slice(0, updatedServiceIndex),
        updatedService,
        ...MOCK_DUE_SERVICES.slice(updatedServiceIndex + 1)
      ],
      isLoading: false,
      isFetchError: false,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: defaultSortOrder
    };

    expect(updatedState).toStrictEqual(expectedState);
  });

  it('updates the services correctly after a successful submittal', () => {

    // Given: We have due services
    const currentState: DueServicesState = {
      dueServices: MOCK_DUE_SERVICES,
      isLoading: false,
      isFetchError: false,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: defaultSortOrder
    };

    // And: We have the services after a successful submittal
    const updatedToCompletedService: DueService = {
      ...MOCK_DUE_SERVICES[0],
      currentStatus: ServiceStatus.COMPLETED
    }

    const updatedToCancelService: DueService = {
      ...MOCK_DUE_SERVICES[2],
      currentStatus: ServiceStatus.CANCELLED
    }

    const submittedServices = [updatedToCompletedService, updatedToCancelService];

    const updateAction: DashboardAction = {
      type: 'DUE_SERVICES_UPDATE_SERVICE_SUBMIT_SUCCESS',
      payload: submittedServices
    };

    // When: We call the update action
    const updatedState = dueServicesReducer(currentState, updateAction);

    // Then: The expected state should be produced
    const expectedState: DueServicesState = {
      dueServices: [
        MOCK_DUE_SERVICES[1],
      ],
      isLoading: false,
      isFetchError: false,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: defaultSortOrder
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('sets the error state after an unsuccessful submittal', () => {

    // Given: We have due services
    const currentState: DueServicesState = {
      dueServices: MOCK_DUE_SERVICES,
      isLoading: false,
      isFetchError: false,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: defaultSortOrder
    };

    // And: There was a submittal failure
    const updateAction: DashboardAction = {
      type: 'DUE_SERVICES_UPDATE_SERVICE_SUBMIT_FAILURE'
    };

    // When: We call the update action
    const updatedState = dueServicesReducer(currentState, updateAction);

    // Then: The expected state should be produced
    const expectedState: DueServicesState = {
      dueServices: MOCK_DUE_SERVICES,
      isLoading: false,
      isFetchError: false,
      isSubmitUpdateError: true,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: defaultSortOrder
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('sets the page number correctly', () => {

    // Given: We have an initial state
    const state = initialDueServicesState
    const pageNumber = 1;

    const action: DashboardAction = {
      type: 'DUE_SERVICES_CHANGE_PAGE_NUMBER',
      payload: pageNumber
    };

    // When: We update the page number
    const updatedState = dueServicesReducer(state, action);

    // Then: The page number is updated correctly
    const expectedState: DueServicesState = {
      isLoading: false,
      dueServices: [],
      isFetchError: false,
      isSubmitUpdateError: false,
      pageNumber: pageNumber,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: defaultSortOrder
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('sets the items per page correctly', () => {

    // Given: We have an initial state
    const state = initialDueServicesState
    const itemsPerPage = 100;

    const action: DashboardAction = {
      type: 'DUE_SERVICES_CHANGE_ITEMS_PER_PAGE',
      payload: itemsPerPage
    };

    // When: We update the page number
    const updatedState = dueServicesReducer(state, action);

    // Then: The page number is updated correctly
    const expectedState: DueServicesState = {
      isLoading: false,
      dueServices: [],
      isFetchError: false,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: itemsPerPage,
      totalItems: 0,
      sortOrder: defaultSortOrder
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('sets the total items correctly', () => {

    // Given: We have an initial state
    const state = initialDueServicesState
    const totalItems = 100;

    const action: DashboardAction = {
      type: 'DUE_SERVICES_SET_TOTAL_ITEMS',
      payload: totalItems
    };

    // When: We update the page number
    const updatedState = dueServicesReducer(state, action);

    // Then: The page number is updated correctly
    const expectedState: DueServicesState = {
      isLoading: false,
      dueServices: [],
      isFetchError: false,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: totalItems,
      sortOrder: defaultSortOrder
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('only toggles the sort direction when order by does not change', () => {

    // Given: We have an initial state
    const state = initialDueServicesState
    const newOrderBy: DashboardOrderByOptions = DashboardOrderByOptions.DUE_DATE // Default  order by is DUE_DATE

    const action: DashboardAction = {
      type: 'DUE_SERVICES_SET_SORT_ORDER',
      payload: newOrderBy
    };

    // When: We update the sort order
    const updatedState = dueServicesReducer(state, action);

    // Then: The direction is updated correctly
    const expectedState: DueServicesState = {
      isLoading: false,
      dueServices: [],
      isFetchError: false,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: {orderBy: DashboardOrderByOptions.DUE_DATE, direction: OrderByOptions.ASC}
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('sorts the direction to ASC when order by changes', () => {

    // Given: We have an initial state
    const state = initialDueServicesState
    const newOrderBy: DashboardOrderByOptions = DashboardOrderByOptions.STATUS

    const action: DashboardAction = {
      type: 'DUE_SERVICES_SET_SORT_ORDER',
      payload: newOrderBy
    };

    // When: We update the sort order
    const updatedState = dueServicesReducer(state, action);

    // Then: The order by is updated correctly and in ASC
    const expectedState: DueServicesState = {
      isLoading: false,
      dueServices: [],
      isFetchError: false,
      isSubmitUpdateError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0,
      sortOrder: {orderBy: DashboardOrderByOptions.STATUS, direction: OrderByOptions.ASC}
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  it.each([
    [DashboardOrderByOptions.CLIENT, OrderByOptions.ASC, "client:asc"],
    [DashboardOrderByOptions.STATUS, OrderByOptions.DESC, "status:desc"],
    [DashboardOrderByOptions.DUE_DATE, OrderByOptions.ASC, "due_date:asc"],
  ])('converts sort order to query param correctly', (orderBy, direction, expected) => {

    // Given: We have a sort order
    const sort: SortOrder = {
      orderBy: orderBy,
      direction: direction
    };

    // When: We convert it to a query param
    const sortQueryParam = convertSortOrderToQueryParam(sort);

    // Then: It should have the correct pattern
    expect(sortQueryParam).toStrictEqual(expected)

  });

});
