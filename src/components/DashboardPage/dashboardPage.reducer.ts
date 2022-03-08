import DueService from "../../shared/DueService.model";

interface DueServicesState {
    isLoading: boolean;
    dueServices: Array<DueService>;
};

const initialDueServicesState: DueServicesState = {
    isLoading: false,
    dueServices: []
};

interface DueServicesFetchInitAction {
    type: 'DUE_SERVICES_FETCH_INIT';
};

interface DueServicesFetchSuccessAction {
    type: 'DUE_SERVICES_FETCH_SUCCESS';
    payload: Array<DueService>;
};

type DueServicesAction =
    | DueServicesFetchInitAction
    | DueServicesFetchSuccessAction

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
        default:
            throw new Error(`Illegal Dashboard action was provided`);
    }
};

export default dueServicesReducer;
export { initialDueServicesState, dueServicesReducer };
export type { DueServicesAction as DashboardAction }