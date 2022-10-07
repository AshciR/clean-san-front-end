import {ClientWithContracts} from "../../../shared/ClientWithContracts.model";
import Contract from "../../../shared/Contract.model";

interface AssociatedContractsModalState {
  isOpen: boolean
  clientWithContracts?: ClientWithContracts
  selectedContract?: Contract
}

const initialAssociatedContractsModalState: AssociatedContractsModalState = {
  isOpen: false,
  clientWithContracts: undefined,
  selectedContract: undefined
}

interface AssociatedContractsSelectClientAction {
  type: 'ASSOCIATED_CONTRACTS_SELECT_CLIENT';
  payload: ClientWithContracts;
}

interface AssociatedContractsCloseModalAction {
  type: 'ASSOCIATED_CONTRACTS_CLOSE_MODAL';
}

interface AssociatedContractsOpenStartContractAlertAction {
  type: 'ASSOCIATED_CONTRACTS_OPEN_START_CONTRACT_ALERT';
  payload: Contract;
}

interface AssociatedContractsOpenCancelContractAlertAction {
  type: 'ASSOCIATED_CONTRACTS_OPEN_CANCEL_CONTRACT_ALERT';
  payload: Contract;
}

type AssociatedContractsAction =
  AssociatedContractsSelectClientAction
  | AssociatedContractsCloseModalAction
  | AssociatedContractsOpenStartContractAlertAction
  | AssociatedContractsOpenCancelContractAlertAction

const associatedContractsReducer = (
  state: AssociatedContractsModalState,
  action: AssociatedContractsAction
) => {

  switch (action.type) {
    case "ASSOCIATED_CONTRACTS_SELECT_CLIENT":
      const selectedClientState: AssociatedContractsModalState = {
        ...state,
        isOpen: true,
        clientWithContracts: action.payload,
        selectedContract: undefined
      };
      return selectedClientState;
    case "ASSOCIATED_CONTRACTS_CLOSE_MODAL":
      const closeModalState: AssociatedContractsModalState = {
        ...state,
        isOpen: false,
        selectedContract: undefined
      };
      return closeModalState;
    case "ASSOCIATED_CONTRACTS_OPEN_START_CONTRACT_ALERT":
      const selectedContractStartState: AssociatedContractsModalState = {
        ...state,
        isOpen: true,
        selectedContract: action.payload
      };
      return selectedContractStartState;
    case "ASSOCIATED_CONTRACTS_OPEN_CANCEL_CONTRACT_ALERT":
      const selectedContractCancelState: AssociatedContractsModalState = {
        ...state,
        isOpen: true,
        selectedContract: action.payload
      };
      return selectedContractCancelState;
    default:
      throw new Error(`Illegal AssociatedContracts action was provided`);
  }

}

export type {AssociatedContractsAction, AssociatedContractsModalState}
export {initialAssociatedContractsModalState, associatedContractsReducer}