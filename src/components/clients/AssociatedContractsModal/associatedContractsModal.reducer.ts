import {ClientWithContracts} from "../../../shared/ClientWithContracts.model";

interface AssociatedContractsModalState {
  isOpen: boolean
  clientWithContracts?: ClientWithContracts
}

const initialAssociatedContractsModalState: AssociatedContractsModalState = {
  isOpen: false,
  clientWithContracts: undefined,
}

interface AssociatedContractsClientSelectAction {
  type: 'ASSOCIATED_CONTRACTS_SELECT_CLIENT';
  payload: ClientWithContracts
}

interface AssociatedContractsCloseModalAction {
  type: 'ASSOCIATED_CONTRACTS_CLOSE_MODAL';
}

type AssociatedContractsAction =
  AssociatedContractsClientSelectAction
  | AssociatedContractsCloseModalAction


const associatedContractsReducer = (
  state: AssociatedContractsModalState,
  action: AssociatedContractsAction
) => {

  switch (action.type) {
    case "ASSOCIATED_CONTRACTS_SELECT_CLIENT":
      const selectedClientState: AssociatedContractsModalState = {
        ...state,
        isOpen: true,
        clientWithContracts: action.payload
      };
      return selectedClientState;
    case "ASSOCIATED_CONTRACTS_CLOSE_MODAL":
      const closeModalState: AssociatedContractsModalState = {
        ...state,
        isOpen: false
      };
      return closeModalState
    default:
      throw new Error(`Illegal AssociatedContracts action was provided`);
  }

}

export type {AssociatedContractsAction, AssociatedContractsModalState}
export {initialAssociatedContractsModalState, associatedContractsReducer}