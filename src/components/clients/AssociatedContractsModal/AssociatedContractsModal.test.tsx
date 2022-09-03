import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AssociatedContractsModal from './AssociatedContractsModal';
import {getClientsResponse} from "../../../mocks/clientsEndpointResponses";
import {convertClientResponseToClientWithContracts} from "../../../services/clients.services";
import {AssociatedContractsModalState} from "./associatedContractsModal.reducer";

describe('<AssociatedContractsModal />', () => {

  const clientWithContracts = convertClientResponseToClientWithContracts(getClientsResponse.clients[0]);
  const modalState: AssociatedContractsModalState = {
    isOpen: true,
    clientWithContracts: clientWithContracts,
  }

  const mockHandleCloseAssociatedContractsModal = jest.fn();

  it("modal should display client's name", () => {
    render(<AssociatedContractsModal
      modalState={modalState}
      handleCloseAssociatedContractsModal={mockHandleCloseAssociatedContractsModal}
    />);
    const clientName = screen.getByText(`Contracts for ${clientWithContracts.name}`);
    expect(clientName).toBeInTheDocument();
  });

  it("modal should display all client's contracts", () => {
    render(<AssociatedContractsModal
      modalState={modalState}
      handleCloseAssociatedContractsModal={mockHandleCloseAssociatedContractsModal}
    />);
    const numberOfContracts = clientWithContracts.contracts.length;
    const contractCards = screen.getAllByText(/Start date:/);
    expect(contractCards.length).toBe(numberOfContracts)
  });

  it("modal should have add contract button", () => {
    render(<AssociatedContractsModal
      modalState={modalState}
      handleCloseAssociatedContractsModal={mockHandleCloseAssociatedContractsModal}
    />);
    const addContractButton = screen.getByRole('button', {name: 'Add Contract'});
    expect(addContractButton).toBeInTheDocument();
  });

  it("modal should close when the close button is clicked", () => {
    render(<AssociatedContractsModal
      modalState={modalState}
      handleCloseAssociatedContractsModal={mockHandleCloseAssociatedContractsModal}
    />);
    const closeButton = screen.getByRole('button', {name: 'Close'});

    // When: the close button is clicked
    fireEvent.click(closeButton);

    // Then: the handler should be invoked
    expect(mockHandleCloseAssociatedContractsModal).toBeCalledTimes(1);

  });

});