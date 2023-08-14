import DueService from "../../../shared/DueService.model";
import ServiceStatus from "../../../shared/ServiceStatus.model";

interface DueServicesState {
  isLoading: boolean;
  dueServices: Array<DueService>;
  isFetchError: boolean;
  isSubmitUpdateError: boolean;
  pageNumber: number;
  itemsPerPage: number;
  totalItems: number;
  sortOrder: SortOrder;
}

interface SortOrder {
  orderBy: DashboardOrderByOptions;
  direction: OrderByOptions;
}

enum DashboardOrderByOptions {
  CLIENT = 'client',
  STATUS = 'status',
  DUE_DATE = 'due_date'
}

enum OrderByOptions {
  ASC = 'asc',
  DESC = 'desc'
}

const ITEMS_PER_PAGE_OPTIONS: number[] = [25, 50, 100];
const defaultItemsPerPage = ITEMS_PER_PAGE_OPTIONS[0];
const defaultSortOrder: SortOrder = {
  orderBy: DashboardOrderByOptions.DUE_DATE,
  direction: OrderByOptions.DESC
};

const initialDueServicesState: DueServicesState = {
  isLoading: false,
  dueServices: [],
  isFetchError: false,
  isSubmitUpdateError: false,
  pageNumber: 0,
  itemsPerPage: defaultItemsPerPage,
  totalItems: 0,
  sortOrder: defaultSortOrder
};

interface DueServicesFetchInitAction {
  type: 'DUE_SERVICES_FETCH_INIT';
}

interface DueServicesFetchSuccessAction {
  type: 'DUE_SERVICES_FETCH_SUCCESS';
  payload: Array<DueService>;
}

interface DueServicesFetchFailureAction {
  type: 'DUE_SERVICES_FETCH_FAILURE';
}

interface DueServicesUpdateServiceAction {
  type: 'DUE_SERVICES_UPDATE_SERVICE';
  payload: DueService;
}

interface DueServicesUpdateServiceSuccessAction {
  type: 'DUE_SERVICES_UPDATE_SERVICE_SUBMIT_SUCCESS';
  payload: DueService[];
}

interface DueServicesUpdateServiceFailureAction {
  type: 'DUE_SERVICES_UPDATE_SERVICE_SUBMIT_FAILURE';
}

interface DueServicesChangePageNumberAction {
  type: 'DUE_SERVICES_CHANGE_PAGE_NUMBER';
  payload: number;
}

interface DueServicesChangeItemsPerPageAction {
  type: 'DUE_SERVICES_CHANGE_ITEMS_PER_PAGE';
  payload: number;
}

interface DueServicesSetTotalItemsAction {
  type: 'DUE_SERVICES_SET_TOTAL_ITEMS';
  payload: number;
}

interface DueServicesSetSortOrderAction {
  type: 'DUE_SERVICES_SET_SORT_ORDER';
  payload: DashboardOrderByOptions;
}

type DueServicesAction =
  | DueServicesFetchInitAction
  | DueServicesFetchSuccessAction
  | DueServicesFetchFailureAction
  | DueServicesUpdateServiceAction
  | DueServicesUpdateServiceSuccessAction
  | DueServicesUpdateServiceFailureAction
  | DueServicesChangePageNumberAction
  | DueServicesChangeItemsPerPageAction
  | DueServicesSetTotalItemsAction
  | DueServicesSetSortOrderAction

const dueServicesReducer = (
  state: DueServicesState,
  action: DueServicesAction
) => {

  switch (action.type) {
    case 'DUE_SERVICES_FETCH_INIT':
      const updatedInitState: DueServicesState = {
        ...state,
        isLoading: true,
        isFetchError: false
      };
      return updatedInitState;
    case "DUE_SERVICES_FETCH_SUCCESS":
      const updatedFetchSuccessState: DueServicesState = {
        ...state,
        isLoading: false,
        dueServices: action.payload,
        isFetchError: false
      };
      return updatedFetchSuccessState;
    case "DUE_SERVICES_FETCH_FAILURE":
      const updatedFetchFailureState: DueServicesState = {
        ...state,
        isLoading: false,
        isFetchError: true,
        dueServices: []
      };
      return updatedFetchFailureState;
    case "DUE_SERVICES_UPDATE_SERVICE":
      const updatedServiceState: DueServicesState = {
        ...state,
        dueServices: updateService(state.dueServices, action.payload)
      }
      return updatedServiceState;
    case "DUE_SERVICES_UPDATE_SERVICE_SUBMIT_SUCCESS":
      const updatedServiceSubmitSuccessState: DueServicesState = {
        ...state,
        isSubmitUpdateError: false,
        dueServices: updateServicesAfterSubmittal(state.dueServices, action.payload)
      }
      return updatedServiceSubmitSuccessState;
    case "DUE_SERVICES_UPDATE_SERVICE_SUBMIT_FAILURE":
      const updatedServiceSubmitFailureState: DueServicesState = {
        ...state,
        isSubmitUpdateError: true
      }
      return updatedServiceSubmitFailureState;
    case "DUE_SERVICES_CHANGE_PAGE_NUMBER":
      const updatedChangePageState: DueServicesState = {
        ...state,
        pageNumber: action.payload
      };
      return updatedChangePageState
    case "DUE_SERVICES_CHANGE_ITEMS_PER_PAGE":
      const updatedChangeItemsPerPageState: DueServicesState = {
        ...state,
        itemsPerPage: action.payload
      };
      return updatedChangeItemsPerPageState
    case "DUE_SERVICES_SET_TOTAL_ITEMS":
      const updatedTotalItemsState: DueServicesState = {
        ...state,
        totalItems: action.payload
      }
      return updatedTotalItemsState
    case "DUE_SERVICES_SET_SORT_ORDER":
      const updatedSortOrderState: DueServicesState = {
        ...state,
        sortOrder: updateSortOrder(state.sortOrder, action.payload)
      }
      return updatedSortOrderState
    default:
      throw new Error(`Illegal Dashboard action was provided`);
  }
};

const updateService = (dueServices: DueService[], updatedService: DueService): DueService[] => {

  const indexToBeReplaced = dueServices.findIndex(service => service.id === updatedService.id);

  return [
    ...dueServices.slice(0, indexToBeReplaced),
    updatedService,
    ...dueServices.slice(indexToBeReplaced + 1)
  ]

}

const updateServicesAfterSubmittal = (dueServicesBeforeSubmittal: DueService[], submittedServices: DueService[]): DueService[] => {

  // We want to update the services in the application state with the values we got from the API call.
  // If a service was updated, we'll use the new value, else, we'll use keep the old one
  const updateListWithSubmittedServices = (submittedServices: DueService[], serviceBeforeSubmittal: DueService) => {

    const idsOfSubmittedServices = submittedServices.map(s => s.id);

    // if the service was submitted add the submitted version to the list
    if (idsOfSubmittedServices.includes(serviceBeforeSubmittal.id)) {
      return submittedServices.find(s => s.id === serviceBeforeSubmittal.id) || serviceBeforeSubmittal;
    } else { // it means the service was not submitted, so add the original version instead
      return serviceBeforeSubmittal;
    }
  };

  const isOngoingService = (status: ServiceStatus) => (status === ServiceStatus.NOT_COMPLETED || status === ServiceStatus.IN_PROGRESS);

  return dueServicesBeforeSubmittal
    .map(serviceBeforeSubmittal => updateListWithSubmittedServices(submittedServices, serviceBeforeSubmittal))
    // After an update, the "non-ongoing" (COMPLETED AND CANCELLED) services should not be displayed
    .filter(serviceAfterSubmittal => isOngoingService(serviceAfterSubmittal.currentStatus))

}

const updateSortOrder = (currentSortOrder: SortOrder, newOrderBy: DashboardOrderByOptions) => {

  if (currentSortOrder.orderBy === newOrderBy) {
    const newDirection = currentSortOrder.direction === OrderByOptions.ASC ? OrderByOptions.DESC : OrderByOptions.ASC;
    return {orderBy: newOrderBy, direction: newDirection};
  }

  return {orderBy: newOrderBy, direction: OrderByOptions.ASC};

};

const convertSortOrderToQueryParam = (sort: SortOrder) => `${sort.orderBy}:${sort.direction}`

export default dueServicesReducer;
export {
  initialDueServicesState,
  dueServicesReducer,
  ITEMS_PER_PAGE_OPTIONS,
  DashboardOrderByOptions,
  OrderByOptions,
  defaultSortOrder,
  convertSortOrderToQueryParam
};
export type {DueServicesAction as DashboardAction, DueServicesState, SortOrder}

