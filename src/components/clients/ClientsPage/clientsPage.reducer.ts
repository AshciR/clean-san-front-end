import {ClientWithContracts, createClientWithContracts} from "../../../shared/ClientWithContracts.model";
import Client from "../../../shared/Client.model";
import Contract from "../../../shared/Contract.model";

interface ClientsState {
  isLoading: boolean;
  clients: ClientWithContracts[];
  isFetchError: boolean;
  isAddClientError: boolean;
  isAddContractError: boolean;
}

const initialClientsState: ClientsState = {
  isLoading: false,
  clients: [],
  isFetchError: false,
  isAddClientError: false,
  isAddContractError: false
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

interface AddContractSuccessAction {
  type: 'CLIENTS_ADD_CONTRACT_SUCCESS'
  payload: Contract
}

interface AddContractFailureAction {
  type: 'CLIENTS_ADD_CONTRACT_FAILURE'
}

type ClientsAction =
  ClientsFetchInitAction
  | ClientsFetchSuccessAction
  | ClientsFetchFailureAction
  | AddClientSuccessAction
  | AddClientFailureAction
  | AddContractSuccessAction
  | AddContractFailureAction

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
    case "CLIENTS_ADD_CONTRACT_SUCCESS":
      const addContractSuccessState: ClientsState = {
        ...state,
        isAddContractError: false,
        // @ts-ignore There will be an associated client b/c the user had to click on it in the 1st place
        clients: addContractToClient(state.clients, action.payload)
      }
      return addContractSuccessState
    case "CLIENTS_ADD_CONTRACT_FAILURE":
      const addContractFailureState: ClientsState = {
        ...state,
        isAddContractError: true
      }
      return addContractFailureState
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

const addContractToClient = (currentClients: ClientWithContracts[], newlyAddedContract: Contract) => {

  const associatedClient = currentClients.find(client => client.id === newlyAddedContract.clientId);
  const updatedClient = {
    ...associatedClient,
    // @ts-ignore There will be an associated client b/c the user had to click on it in the 1st place
    contracts: [...associatedClient.contracts, newlyAddedContract]
  }

  // We want to preserve the ordering of the clients
  const indexOfClient = currentClients.findIndex(client => client.id === newlyAddedContract.clientId);

  return [
    ...currentClients.slice(0, indexOfClient),
    updatedClient,
    ...currentClients.slice(indexOfClient + 1)
  ]

};

export {initialClientsState, clientsReducer}
export type {ClientsAction, ClientsState}
