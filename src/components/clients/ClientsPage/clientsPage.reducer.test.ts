import {ClientsAction, clientsReducer, ClientsState, initialClientsState} from "./clientsPage.reducer";
import MOCK_CLIENTS_WITH_CONTRACTS from "../../../shared/mockClientsWithContractsData";
import {createClient} from "../../../shared/Client.model";
import {createClientWithContracts} from "../../../shared/ClientWithContracts.model";

describe('ClientPage Reducer', () => {

  it('initializes fetching clients', () => {

    // Given: We have a current state and an action
    const state = initialClientsState;
    const initAction: ClientsAction = {
      type: 'CLIENTS_FETCH_INIT'
    };

    // When: We call the reducer
    const updatedState = clientsReducer(state, initAction);

    // Then: The expected state should be produced
    const expectedState: ClientsState = {
      isLoading: true,
      clients: [],
      isFetchError: false,
      isAddClientError: false
    }
    expect(updatedState).toStrictEqual(expectedState);
  });

  it('fetches clients successfully', () => {

    // Given: We have a current state and an action
    const state = initialClientsState;
    const successAction: ClientsAction = {
      type: 'CLIENTS_FETCH_SUCCESS',
      payload: MOCK_CLIENTS_WITH_CONTRACTS
    };

    // When: We call the reducer
    const updatedState = clientsReducer(state, successAction);

    // Then: The expected state should be produced
    const expectedState: ClientsState = {
      isLoading: false,
      clients: MOCK_CLIENTS_WITH_CONTRACTS,
      isFetchError: false,
      isAddClientError: false
    }
    expect(updatedState).toStrictEqual(expectedState);
  });

  it('fails to fetch clients', () => {

    // Given: We have a current state and an action
    const state = initialClientsState;
    const failedAction: ClientsAction = {
      type: 'CLIENTS_FETCH_FAILURE'
    };

    // When: We call the reducer
    const updatedState = clientsReducer(state, failedAction);

    // Then: The expected state should be produced
    const expectedState: ClientsState = {
      isLoading: false,
      clients: [],
      isFetchError: true,
      isAddClientError: false
    }
    expect(updatedState).toStrictEqual(expectedState);
  });

  it('clears existing clients when it fails to fetch clients', () => {

    // Given: We have previously successfully fetched due services
    const state = initialClientsState
    const successAction: ClientsAction = {
      type: 'CLIENTS_FETCH_SUCCESS',
      payload: MOCK_CLIENTS_WITH_CONTRACTS
    };

    const stateWithClients = clientsReducer(state, successAction);

    // When: We fail the second fetch call
    const failAction: ClientsAction = {
      type: 'CLIENTS_FETCH_FAILURE'
    };
    const updatedState = clientsReducer(stateWithClients, failAction);

    // Then: The expected state should be produced
    const expectedState: ClientsState = {
      clients: [],
      isLoading: false,
      isFetchError: true,
      isAddClientError: false
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('adds a client successfully', () => {

    // Given: We have a current state and an action
    const state = initialClientsState;
    const submittedProspectiveClient = createClient({
      id: 1,
      name: "Rick",
      email: "rick@gmail.com",
      isActive: false,
    });
    const addClientSuccessAction: ClientsAction = {
      type: 'CLIENTS_ADD_CLIENT_SUCCESS',
      payload: submittedProspectiveClient
    };

    // When: We call the reducer
    const updatedState = clientsReducer(state, addClientSuccessAction);

    // Then: The expected state should be produced
    const addedClientWithEmptyContract = createClientWithContracts({
      id: submittedProspectiveClient.id,
      name: submittedProspectiveClient.name,
      email: submittedProspectiveClient.email,
      isActive: false,
      contracts: []
    })

    const expectedState: ClientsState = {
      isLoading: false,
      clients: [addedClientWithEmptyContract],
      isFetchError: false,
      isAddClientError: false
    }

    expect(updatedState).toStrictEqual(expectedState);
  });

  it('fails to add a client', () => {

    // Given: We have a current state and an action
    const state = initialClientsState;
    const addClientSuccessAction: ClientsAction = {
      type: 'CLIENTS_ADD_CLIENT_FAILURE',
    };

    // When: We call the reducer
    const updatedState = clientsReducer(state, addClientSuccessAction);

    // Then: The expected state should be produced
    const expectedState: ClientsState = {
      isLoading: false,
      clients: [],
      isFetchError: false,
      isAddClientError: true,
    }

    expect(updatedState).toStrictEqual(expectedState);
  });

});