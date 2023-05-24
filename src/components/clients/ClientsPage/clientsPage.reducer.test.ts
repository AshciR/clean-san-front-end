import {
  ClientsAction,
  clientsReducer,
  ClientsState,
  initialClientsState,
  ITEMS_PER_PAGE_OPTIONS
} from "./clientsPage.reducer";
import MOCK_CLIENTS_WITH_CONTRACTS from "../../../shared/mockClientsWithContractsData";
import {createClient} from "../../../shared/Client.model";
import {createClientWithContracts} from "../../../shared/ClientWithContracts.model";
import {ContractStatus, createContract, createDefaultContract, ServiceFrequency} from "../../../shared/Contract.model";
import {DateTime} from "luxon";

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
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
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
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
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
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
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
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
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
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
    }

    expect(updatedState).toStrictEqual(expectedState);
  });

  it('fails to add a client', () => {

    // Given: We have a current state and an action
    const state = initialClientsState;
    const addClientFailureAction: ClientsAction = {
      type: 'CLIENTS_ADD_CLIENT_FAILURE',
    };

    // When: We call the reducer
    const updatedState = clientsReducer(state, addClientFailureAction);

    // Then: The expected state should be produced
    const expectedState: ClientsState = {
      isLoading: false,
      clients: [],
      isFetchError: false,
      isAddClientError: true,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
    }

    expect(updatedState).toStrictEqual(expectedState);
  });

  it('adds a contract successfully', () => {

    // Given: We have a current state with a client
    const initialState = {
      isLoading: false,
      clients: [
        createClientWithContracts({
          id: 1,
          name: "Rick",
          email: "rick@gmail.com",
          isActive: false,
          contracts: []
        }),
        createClientWithContracts({
          id: 2,
          name: "Morty",
          email: "morty@gmail.com",
          isActive: false,
          contracts: []
        })
      ],
      isFetchError: false,
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
    };

    // And: We have an action
    const newContract = createDefaultContract()
    const addContractSuccessAction: ClientsAction = {
      type: 'CLIENTS_ADD_CONTRACT_SUCCESS',
      payload: newContract
    };

    // When: We call the reducer
    const updatedState = clientsReducer(initialState, addContractSuccessAction);

    // Then: The expected state should be produced
    const expectedState: ClientsState = {
      isLoading: false,
      clients: [
        createClientWithContracts({
          id: 1,
          name: "Rick",
          email: "rick@gmail.com",
          isActive: false,
          contracts: [newContract]
        }),
        createClientWithContracts({
          id: 2,
          name: "Morty",
          email: "morty@gmail.com",
          isActive: false,
          contracts: []
        })
      ],
      isFetchError: false,
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
    }

    expect(updatedState).toStrictEqual(expectedState);
  });

  it('fails to add a contract', () => {

    // Given: We have a current state and an action
    const state = initialClientsState;
    const addClientFailureAction: ClientsAction = {
      type: 'CLIENTS_ADD_CONTRACT_FAILURE',
    };

    // When: We call the reducer
    const updatedState = clientsReducer(state, addClientFailureAction);

    // Then: The expected state should be produced
    const expectedState: ClientsState = {
      isLoading: false,
      clients: [],
      isFetchError: false,
      isAddClientError: false,
      isAddContractError: true,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
    }

    expect(updatedState).toStrictEqual(expectedState);
  });

  it('starts a contract successfully', () => {

    // Given: We have a current state with a client who has a contract
    const activeContract = createDefaultContract();
    const inactiveContract = createContract({
      id: 11,
      clientId: 1,
      startDate: DateTime.now(),
      endDate: DateTime.now().plus({years: 1}),
      serviceFrequency: ServiceFrequency.WEEKLY,
      status: ContractStatus.INACTIVE
    });

    const initialState = {
      isLoading: false,
      clients: [
        createClientWithContracts({
          id: 1,
          name: "Rick",
          email: "rick@gmail.com",
          isActive: false,
          contracts: [inactiveContract, activeContract]
        }),
      ],
      isFetchError: false,
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
    };

    // And: We have an action
    const startedContract = {...inactiveContract, status: ContractStatus.ACTIVE};
    const startContractSuccessAction: ClientsAction = {
      type: 'CLIENTS_START_CONTRACT_SUCCESS',
      payload: startedContract
    };

    // When: We call the reducer
    const updatedState = clientsReducer(initialState, startContractSuccessAction);

    // Then: The expected state should be produced
    const expectedState: ClientsState = {
      isLoading: false,
      clients: [
        createClientWithContracts({
          id: 1,
          name: "Rick",
          email: "rick@gmail.com",
          isActive: true,
          contracts: [startedContract, activeContract]
        }),
      ],
      isFetchError: false,
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('fails to start a contract', () => {

    // Given: We have a current state and an action
    const state = initialClientsState;
    const startContractFailureAction: ClientsAction = {
      type: 'CLIENTS_START_CONTRACT_FAILURE',
    };

    // When: We call the reducer
    const updatedState = clientsReducer(state, startContractFailureAction);

    // Then: The expected state should be produced
    const expectedState: ClientsState = {
      isLoading: false,
      clients: [],
      isFetchError: false,
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: true,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
    }

    expect(updatedState).toStrictEqual(expectedState);
  });

  it('cancels a contract successfully', () => {

    // Given: We have a current state with a client who has a contract
    const activeContract = createDefaultContract();
    const inactiveContract = createContract({
      id: 11,
      clientId: 1,
      startDate: DateTime.now(),
      endDate: DateTime.now().plus({years: 1}),
      serviceFrequency: ServiceFrequency.WEEKLY,
      status: ContractStatus.INACTIVE
    });

    const initialState = {
      isLoading: false,
      clients: [
        createClientWithContracts({
          id: 1,
          name: "Rick",
          email: "rick@gmail.com",
          isActive: true,
          contracts: [activeContract, inactiveContract]
        }),
      ],
      isFetchError: false,
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
    };

    // And: We have an action
    const cancelledContract = {...activeContract, status: ContractStatus.CANCELLED};
    const cancelContractSuccessAction: ClientsAction = {
      type: 'CLIENTS_CANCEL_CONTRACT_SUCCESS',
      payload: cancelledContract
    };

    // When: We call the reducer
    const updatedState = clientsReducer(initialState, cancelContractSuccessAction);

    // Then: The expected state should be produced
    const expectedState: ClientsState = {
      isLoading: false,
      clients: [
        createClientWithContracts({
          id: 1,
          name: "Rick",
          email: "rick@gmail.com",
          isActive: false,
          contracts: [cancelledContract, inactiveContract]
        }),
      ],
      isFetchError: false,
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('fails to cancel a contract', () => {

    // Given: We have a current state and an action
    const state = initialClientsState;
    const startContractFailureAction: ClientsAction = {
      type: 'CLIENTS_CANCEL_CONTRACT_FAILURE',
    };

    // When: We call the reducer
    const updatedState = clientsReducer(state, startContractFailureAction);

    // Then: The expected state should be produced
    const expectedState: ClientsState = {
      isLoading: false,
      clients: [],
      isFetchError: false,
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: true,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
    }

    expect(updatedState).toStrictEqual(expectedState);
  });

  it('sets the page number correctly', () => {

    // Given: We have an initial state
    const state = initialClientsState
    const pageNumber = 1;

    const action: ClientsAction = {
      type: 'CLIENTS_CHANGE_PAGE_NUMBER',
      payload: pageNumber
    };

    // When: We update the page number
    const updatedState = clientsReducer(state, action)

    // Then: The page number is updated correctly
    const expectedState: ClientsState = {
      isLoading: false,
      clients: [],
      isFetchError: false,
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: pageNumber,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: 0
    }

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('sets the items per page correctly', () => {

    // Given: We have an initial state
    const state = initialClientsState
    const itemsPerPage = 100;

    const action: ClientsAction = {
      type: 'CLIENTS_CHANGE_ITEMS_PER_PAGE',
      payload: itemsPerPage
    };

    // When: We update the page number
    const updatedState = clientsReducer(state, action)

    // Then: The page number is updated correctly
    const expectedState: ClientsState = {
      isLoading: false,
      clients: [],
      isFetchError: false,
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: itemsPerPage,
      totalItems: 0
    }

    expect(updatedState).toStrictEqual(expectedState);
  });

  it('sets the total items correctly', () => {
    // Given: We have an initial state
    const state = initialClientsState
    const totalItems = 100;

    const action: ClientsAction = {
      type: 'CLIENTS_SET_TOTAL_ITEMS',
      payload: totalItems
    };

    // When: We update the page number
    const updatedState = clientsReducer(state, action)

    // Then: The page number is updated correctly
    const expectedState: ClientsState = {
      isLoading: false,
      clients: [],
      isFetchError: false,
      isAddClientError: false,
      isAddContractError: false,
      isUpdateContractError: false,
      pageNumber: 0,
      itemsPerPage: ITEMS_PER_PAGE_OPTIONS[0],
      totalItems: totalItems
    }

    expect(updatedState).toStrictEqual(expectedState);
  });

});