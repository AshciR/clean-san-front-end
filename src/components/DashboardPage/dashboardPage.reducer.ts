import DueService from "../../shared/DueService.model";
import ServiceStatus from "../../shared/ServiceStatus.model";

interface DueServicesState {
  isLoading: boolean;
  dueServices: Array<DueService>;
  isFetchError: boolean;
  isSubmitUpdateError: boolean;
};

const initialDueServicesState: DueServicesState = {
  isLoading: false,
  dueServices: [],
  isFetchError: false,
  isSubmitUpdateError: false
};

interface DueServicesFetchInitAction {
  type: 'DUE_SERVICES_FETCH_INIT';
};

interface DueServicesFetchSuccessAction {
  type: 'DUE_SERVICES_FETCH_SUCCESS';
  payload: Array<DueService>;
};

interface DueServicesFetchFailureAction {
  type: 'DUE_SERVICES_FETCH_FAILURE';
};

interface DueServicesUpdateServiceAction {
  type: 'DUE_SERVICES_UPDATE_SERVICE';
  payload: DueService;
};

interface DueServicesUpdateServiceSuccessAction {
  type: 'DUE_SERVICES_UPDATE_SERVICE_SUBMIT_SUCCESS';
  payload: DueService[];
};

interface DueServicesUpdateServiceFailureAction {
  type: 'DUE_SERVICES_UPDATE_SERVICE_SUBMIT_FAILURE';
};

type DueServicesAction =
  | DueServicesFetchInitAction
  | DueServicesFetchSuccessAction
  | DueServicesFetchFailureAction
  | DueServicesUpdateServiceAction
  | DueServicesUpdateServiceSuccessAction
  | DueServicesUpdateServiceFailureAction

const dueServicesReducer = (
  state: DueServicesState,
  action: DueServicesAction
) => {

  switch (action.type) {
    case 'DUE_SERVICES_FETCH_INIT':
      const updatedInitState: DueServicesState = {
        ...state,
        isLoading: true,
      };
      return updatedInitState;
    case "DUE_SERVICES_FETCH_SUCCESS":
      const updatedFetchSuccessState: DueServicesState = {
        ...state,
        isLoading: false,
        dueServices: action.payload
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

export default dueServicesReducer;
export {initialDueServicesState, dueServicesReducer};
export type {DueServicesAction as DashboardAction, DueServicesState}

