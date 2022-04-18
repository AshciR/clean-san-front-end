import DueService from "../../shared/DueService.model";

interface DueServicesState {
    isLoading: boolean;
    dueServices: Array<DueService>;
    isError: boolean;
};

const initialDueServicesState: DueServicesState = {
    isLoading: false,
    dueServices: [],
    isError: false
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

type DueServicesAction =
    | DueServicesFetchInitAction
    | DueServicesFetchSuccessAction
    | DueServicesFetchFailureAction
    | DueServicesUpdateServiceAction

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
            const updatedSuccessState: DueServicesState = {
                ...state,
                isLoading: false,
                dueServices: action.payload
            };
            return updatedSuccessState;
        case "DUE_SERVICES_FETCH_FAILURE":
            const updatedFailureState: DueServicesState = {
                ...state,
                isLoading: false,
                isError: true,
                dueServices: []
            };
            return updatedFailureState;
        case "DUE_SERVICES_UPDATE_SERVICE":
            const updatedServiceStatusState: DueServicesState = {
                ...state,
                dueServices: updateServiceStatus(state.dueServices, action.payload),
            }
            return updatedServiceStatusState;
        default:
            throw new Error(`Illegal Dashboard action was provided`);
    }
};


const updateServiceStatus = (dueServices: DueService[], updatedService: DueService): DueService[] => {

    return dueServices
        .filter(service => service.id !== updatedService.id)
        .concat(updatedService).sort((a, b) => a.id - b.id);
    
}

export default dueServicesReducer;
export { initialDueServicesState, dueServicesReducer };
export type { DueServicesAction as DashboardAction }