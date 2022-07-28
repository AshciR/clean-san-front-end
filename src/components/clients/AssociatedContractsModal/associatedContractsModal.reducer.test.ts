import {convertClientResponseToClientWithContracts} from "../../../services/clients.services";
import {getClientsResponse} from "../../../mocks/clientsEndpointResponses";
import {
  AssociatedContractsAction,
  AssociatedContractsModalState,
  associatedContractsReducer,
  initialAssociatedContractsModalState
} from "./associatedContractsModal.reducer";

describe('AssociatedContractsModal Reducer', () => {

  const clientWithContracts = convertClientResponseToClientWithContracts(getClientsResponse.clients[0]);

  it('select the client with the associated contracts', () => {

    // Given: We have a current state and an action
    const state: AssociatedContractsModalState = initialAssociatedContractsModalState;

    const action: AssociatedContractsAction = {
      type: "ASSOCIATED_CONTRACTS_SELECT_CLIENT",
      payload: clientWithContracts
    };

    // When: We call the reducer
    const updatedState = associatedContractsReducer(state, action);

    // Then: The expected state should be produced
    const expectedState: AssociatedContractsModalState = {
      isOpen: true,
      clientWithContracts: clientWithContracts
    }

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('closes the modal', () => {

    // Given: We have a current state and an action
    const state: AssociatedContractsModalState = {
      isOpen: true,
      clientWithContracts: clientWithContracts
    };

    const action: AssociatedContractsAction = {
      type: "ASSOCIATED_CONTRACTS_CLOSE_MODAL"
    };

    // When: We call the reducer
    const updatedState = associatedContractsReducer(state, action);

    // Then: The expected state should be produced
    const expectedState: AssociatedContractsModalState = {
      isOpen: false,
      clientWithContracts: undefined
    }

    expect(updatedState).toStrictEqual(expectedState);

  });

});