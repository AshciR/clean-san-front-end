import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AssociatedContractsModal from './AssociatedContractsModal';
import {getClientsResponse} from "../../../mocks/clientsEndpointResponses";
import {convertClientResponseToClientWithContracts} from "../../../services/clients.services";

describe('<AssociatedContractsModal />', () => {

  const clientWithContracts = convertClientResponseToClientWithContracts(getClientsResponse.clients[0]);

  it("modal should display client's name", () => {
    render(<AssociatedContractsModal clientWithContracts={clientWithContracts}/>);
    const clientName = screen.getByText(`Contracts for ${clientWithContracts.name}`);
    expect(clientName).toBeInTheDocument();
  });

  it("modal should display all client's contracts", () => {
    render(<AssociatedContractsModal clientWithContracts={clientWithContracts}/>);
    const numberOfContracts = clientWithContracts.contracts.length;
    const contractCards = screen.getAllByText(/Start date:/);
    expect(contractCards.length).toBe(numberOfContracts)
  });

  it("modal should have add contract button", () => {
    render(<AssociatedContractsModal clientWithContracts={clientWithContracts}/>);
    const addContractButton = screen.getByRole('button', {name: 'Add Contract'});
    expect(addContractButton).toBeInTheDocument();
  });

});