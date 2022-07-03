import DueService from "../../../shared/DueService.model";

interface AssociatedServicesModalState {
  isOpen: boolean;
  associatedServices: DueService[]
  selectedService?: DueService
  isLoading: boolean;
  isFetchError: boolean;
}

const initialAssociatedServicesModalState: AssociatedServicesModalState = {
  isOpen: false,
  associatedServices: [],
  selectedService: undefined,
  isLoading: false,
  isFetchError: false
}

interface AssociatedServicesFetchInitAction {
  type: 'ASSOCIATED_SERVICES_FETCH_INIT';
}

interface AssociatedServicesSelectServiceAction {
  type: 'ASSOCIATED_SERVICES_SELECT_SERVICE';
  payload: DueService
}

interface AssociatedServicesFetchSuccessAction {
  type: 'ASSOCIATED_SERVICES_FETCH_SUCCESS';
  payload: DueService[]
}

interface AssociatedServicesCloseModalAction {
  type: 'ASSOCIATED_SERVICES_CLOSE_MODAL';
}

interface AssociatedServicesFetchFailureAction {
  type: 'ASSOCIATED_SERVICES_FETCH_FAILURE';
}

type AssociatedServicesAction =
  AssociatedServicesFetchInitAction
  | AssociatedServicesSelectServiceAction
  | AssociatedServicesFetchSuccessAction
  | AssociatedServicesCloseModalAction
  | AssociatedServicesFetchFailureAction

const associatedServicesReducer = (
  state: AssociatedServicesModalState,
  action: AssociatedServicesAction
) => {

  switch (action.type) {
    case "ASSOCIATED_SERVICES_FETCH_INIT":
      const initFetchState: AssociatedServicesModalState = {
        ...state,
        isOpen: true,
        isLoading: true,
        isFetchError: false
      };
      return initFetchState;
    case "ASSOCIATED_SERVICES_SELECT_SERVICE":
      const selectedServiceState: AssociatedServicesModalState = {
        ...state,
        isOpen: true,
        selectedService: action.payload
      };
      return selectedServiceState
    case "ASSOCIATED_SERVICES_FETCH_SUCCESS":
      const fetchSuccessState: AssociatedServicesModalState = {
        ...state,
        isLoading: false,
        isFetchError: false,
        associatedServices: action.payload
      };
      return fetchSuccessState
    case "ASSOCIATED_SERVICES_CLOSE_MODAL":
      const closeModalState: AssociatedServicesModalState = {
        ...state,
        isOpen: false,
        selectedService: undefined,
        associatedServices: []
      }
      return closeModalState
    case "ASSOCIATED_SERVICES_FETCH_FAILURE":
      const fetchFailureState: AssociatedServicesModalState = {
        ...state,
        isLoading: false,
        isFetchError: true,
        associatedServices: [],
        selectedService: undefined
      };
      return fetchFailureState
    default:
      throw new Error(`Illegal AssociatedServices action was provided`);
  }
}
export type {AssociatedServicesAction, AssociatedServicesModalState}
export {initialAssociatedServicesModalState, associatedServicesReducer}