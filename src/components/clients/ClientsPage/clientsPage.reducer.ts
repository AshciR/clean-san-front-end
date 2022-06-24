import {ClientWithContracts} from "../../../shared/ClientWithContracts.model";

interface ClientsState {
  isLoading: boolean;
  clients: ClientWithContracts[];
  isFetchError: boolean;
}

const initialClientsState: ClientsState = {
  isLoading: false,
  clients: [],
  isFetchError: false,
}

interface ClientsFetchInitAction {
  type: 'CLIENTS_FETCH_INIT'
}

interface ClientsFetchSuccessAction {
  type: 'CLIENTS_FETCH_SUCCESS';
  payload: ClientWithContracts[];
}

interface ClientsFetchFailureAction {
  type: 'CLIENTS_FETCH_FAILURE';
}

type ClientsAction =
  ClientsFetchInitAction
  | ClientsFetchSuccessAction
  | ClientsFetchFailureAction

const clientsReducer = (state: ClientsState, action: ClientsAction) => {

  switch (action.type) {
    case "CLIENTS_FETCH_INIT":
      const updatedInitState: ClientsState = {
        ...state,
        isLoading: true,
        isFetchError: false
      };
      return updatedInitState;
    case "CLIENTS_FETCH_SUCCESS":
      const updatedFetchSuccessState: ClientsState = {
        ...state,
        isLoading: false,
        clients: action.payload,
        isFetchError: false
      };
      return updatedFetchSuccessState;
    case "CLIENTS_FETCH_FAILURE":
      const updatedFetchFailureState: ClientsState = {
        ...state,
        isLoading: false,
        isFetchError: true,
        clients: []
      };
      return updatedFetchFailureState;
    default:
      throw new Error(`Illegal Client action was provided`);
  }

}

export {initialClientsState, clientsReducer}
export type {ClientsAction, ClientsState}