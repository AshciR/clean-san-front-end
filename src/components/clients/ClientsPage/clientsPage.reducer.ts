import {ClientWithContracts, createClientWithContracts} from "../../../shared/ClientWithContracts.model";
import Client from "../../../shared/Client.model";

interface ClientsState {
  isLoading: boolean;
  clients: ClientWithContracts[];
  isFetchError: boolean;
  isAddClientError: boolean
}

const initialClientsState: ClientsState = {
  isLoading: false,
  clients: [],
  isFetchError: false,
  isAddClientError: false
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

interface AddClientSuccessAction {
  type: 'CLIENTS_ADD_CLIENT_SUCCESS'
  payload: Client
}

interface AddClientFailureAction {
  type: 'CLIENTS_ADD_CLIENT_FAILURE'
}

type ClientsAction =
  ClientsFetchInitAction
  | ClientsFetchSuccessAction
  | ClientsFetchFailureAction
  | AddClientSuccessAction
  | AddClientFailureAction

const clientsReducer = (state: ClientsState, action: ClientsAction) => {

  switch (action.type) {
    case "CLIENTS_FETCH_INIT":
      const updatedInitState: ClientsState = {
        ...state,
        isLoading: true,
        isFetchError: false,
        isAddClientError: false
      };
      return updatedInitState;
    case "CLIENTS_FETCH_SUCCESS":
      const updatedFetchSuccessState: ClientsState = {
        ...state,
        isLoading: false,
        clients: action.payload,
        isFetchError: false,
        isAddClientError: false
      };
      return updatedFetchSuccessState;
    case "CLIENTS_FETCH_FAILURE":
      const updatedFetchFailureState: ClientsState = {
        ...state,
        isLoading: false,
        isFetchError: true,
        clients: [],
        isAddClientError: false
      };
      return updatedFetchFailureState;
    case "CLIENTS_ADD_CLIENT_SUCCESS":
      const addClientSuccessState: ClientsState = {
        ...state,
        isAddClientError: false,
        clients: addNewClientToTheCurrentList(state.clients, action.payload)
      }
      return addClientSuccessState
    case "CLIENTS_ADD_CLIENT_FAILURE":
      const addClientFailureState: ClientsState = {
        ...state,
        isAddClientError: true
      }
      return addClientFailureState
    default:
      throw new Error(`Illegal Client action was provided`);
  }

}

const addNewClientToTheCurrentList = (currentClients: ClientWithContracts[], newlyAddedClient: Client) => {

  // When we just add a client, it'll have no contracts associated with it.
  // The user will have to create the contract at a later point
  const newClientWithNoContract = createClientWithContracts({
    id: newlyAddedClient.id,
    name: newlyAddedClient.name,
    email: newlyAddedClient.email,
    isActive: false,
    contracts: []
  });

  return [...currentClients, newClientWithNoContract]
};

export {initialClientsState, clientsReducer}
export type {ClientsAction, ClientsState}