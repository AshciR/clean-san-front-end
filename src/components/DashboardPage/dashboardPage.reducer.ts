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

type DueServicesAction =
    | DueServicesFetchInitAction
    | DueServicesFetchSuccessAction
    | DueServicesFetchFailureAction

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
        default:
            throw new Error(`Illegal Dashboard action was provided`);
    }
};

export default dueServicesReducer;
export { initialDueServicesState, dueServicesReducer };
export type { DueServicesAction as DashboardAction }