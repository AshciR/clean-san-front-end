import DueService from "../../shared/DueService.model";

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

const updateServicesAfterSubmittal = (dueServices: DueService[], submittedServices: DueService[]): DueService[] => {

    const useServiceIfItWasSubmitted = (submittedServices: DueService[], service: DueService) => {
        const idsOfSubmittedServices = submittedServices.map(s => s.id);

        // if the service was submitted add the submitted version to the list
        if (idsOfSubmittedServices.includes(service.id)) {
            return submittedServices.find(s => s.id === service.id) || service;
        } else { // it means the service was not submitted, so add the original version instead
            return service;
        }
    };

    return dueServices.map(service => useServiceIfItWasSubmitted(submittedServices, service));

}

export default dueServicesReducer;
export { initialDueServicesState, dueServicesReducer };
export type { DueServicesAction as DashboardAction, DueServicesState }

