import {ClientsAction, clientsReducer, ClientsState, initialClientsState} from "./clientsPage.reducer";
import MOCK_CLIENTS from "../../../shared/mockClientsData";

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
      isFetchError: false
    }
    expect(updatedState).toStrictEqual(expectedState);
  });

  it('fetches clients successfully', () => {

    // Given: We have a current state and an action
    const state = initialClientsState;
    const successAction: ClientsAction = {
      type: 'CLIENTS_FETCH_SUCCESS',
      payload: MOCK_CLIENTS
    };

    // When: We call the reducer
    const updatedState = clientsReducer(state, successAction);

    // Then: The expected state should be produced
    const expectedState: ClientsState = {
      isLoading: false,
      clients: MOCK_CLIENTS,
      isFetchError: false
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
      isFetchError: true
    }
    expect(updatedState).toStrictEqual(expectedState);
  });

  it('clears existing clients when it fails to fetch clients', () => {

    // Given: We have previously successfully fetched due services
    const state = initialClientsState
    const successAction: ClientsAction = {
      type: 'CLIENTS_FETCH_SUCCESS',
      payload: MOCK_CLIENTS
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
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

});