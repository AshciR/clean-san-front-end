import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AssociatedContractsModal from './AssociatedContractsModal';
import {getClientsResponse} from "../../../mocks/clientsEndpointResponses";
import {convertGetClientResponseToClientWithContracts} from "../../../services/clients.services";
import {AssociatedContractsModalState} from "./associatedContractsModal.reducer";

describe('<AssociatedContractsModal />', () => {

  const clientWithContracts = convertGetClientResponseToClientWithContracts(getClientsResponse.clients[0]);
  const modalState: AssociatedContractsModalState = {
    isOpen: true,
    clientWithContracts: clientWithContracts,
  }

  const mockHandleCloseAssociatedContractsModal = jest.fn();
  const mockHandleOpenAddContractModal = jest.fn();
  const mockHandleOpenStartContractAlert = jest.fn();
  const mockHandleOpenCancelContractAlert = jest.fn();

  it("modal should display client's name", () => {
    render(<AssociatedContractsModal
      modalState={modalState}
      handleCloseAssociatedContractsModal={mockHandleCloseAssociatedContractsModal}
      handleOpenAddContractModal={mockHandleOpenAddContractModal}
      handleOpenStartContractAlert={mockHandleOpenStartContractAlert}
      handleOpenCancelContractAlert={mockHandleOpenCancelContractAlert}
    />);
    const clientName = screen.getByText(`Contracts for ${clientWithContracts.client.name}`);
    expect(clientName).toBeInTheDocument();
  });

  it("modal should display all client's contracts", () => {
    render(<AssociatedContractsModal
      modalState={modalState}
      handleCloseAssociatedContractsModal={mockHandleCloseAssociatedContractsModal}
      handleOpenAddContractModal={mockHandleOpenAddContractModal}
      handleOpenStartContractAlert={mockHandleOpenStartContractAlert}
      handleOpenCancelContractAlert={mockHandleOpenCancelContractAlert}
    />);
    const numberOfContracts = clientWithContracts.contracts.length;
    const contractCards = screen.getAllByText(/Start date:/);
    expect(contractCards.length).toBe(numberOfContracts)
  });

  it("modal should close when add contract button is pressed and open add contract modal", () => {
    render(<AssociatedContractsModal
      modalState={modalState}
      handleCloseAssociatedContractsModal={mockHandleCloseAssociatedContractsModal}
      handleOpenAddContractModal={mockHandleOpenAddContractModal}
      handleOpenStartContractAlert={mockHandleOpenStartContractAlert}
      handleOpenCancelContractAlert={mockHandleOpenCancelContractAlert}
    />);
    const addContractButton = screen.getByRole('button', {name: 'Add Contract'});

    // When: the add contract button is clicked
    fireEvent.click(addContractButton);

    // Then: The associated modal should be closed, and the add contact modal is opened
    expect(mockHandleCloseAssociatedContractsModal).toBeCalledTimes(1);
    expect(mockHandleOpenAddContractModal).toBeCalledTimes(1);
  });

  it("modal should close when the close button is clicked", () => {
    render(<AssociatedContractsModal
      modalState={modalState}
      handleCloseAssociatedContractsModal={mockHandleCloseAssociatedContractsModal}
      handleOpenAddContractModal={mockHandleOpenAddContractModal}
      handleOpenStartContractAlert={mockHandleOpenStartContractAlert}
      handleOpenCancelContractAlert={mockHandleOpenCancelContractAlert}
    />);
    const closeButton = screen.getByRole('button', {name: 'Close'});

    // When: the close button is clicked
    fireEvent.click(closeButton);

    // Then: the handler should be invoked
    expect(mockHandleCloseAssociatedContractsModal).toBeCalledTimes(1);

  });

  it('should disable all start buttons if any contract is active', () => {

    // Given: At least one contract is active. getClientsResponse.clients[0] has an active contract
    render(<AssociatedContractsModal
      modalState={modalState}
      handleCloseAssociatedContractsModal={mockHandleCloseAssociatedContractsModal}
      handleOpenAddContractModal={mockHandleOpenAddContractModal}
      handleOpenStartContractAlert={mockHandleOpenStartContractAlert}
      handleOpenCancelContractAlert={mockHandleOpenCancelContractAlert}
    />);

    // Then: All the start buttons should be disabled
    const startButtons = screen.getAllByRole('button', {name: 'Start'});
    startButtons.forEach(button => expect(button).toBeDisabled());
  });

});