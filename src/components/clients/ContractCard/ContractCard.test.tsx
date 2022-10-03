import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ContractCard from './ContractCard';
import {getClientsResponse} from "../../../mocks/clientsEndpointResponses";
import {convertContractResponseToContract} from "../../../services/shared-responses";
import {DateTime} from "luxon";
import {convertToSentenceCase} from "../../../setupTests";

describe('<ContractCard />', () => {

  const contracts = getClientsResponse.clients[0].contracts.map(contract => convertContractResponseToContract(contract));
  const contract = contracts[0];

  const mockHandleOpenStartContractAlert = jest.fn();

  it('should display start date', () => {
    render(<ContractCard
      contract={contract}
      handleOpenStartContractAlert={mockHandleOpenStartContractAlert}
    />);
    const contractCard = screen.getByText(contract.startDate.toLocaleString(DateTime.DATE_MED));
    expect(contractCard).toBeInTheDocument();
  });

  it('should display end date', () => {
    render(<ContractCard
      contract={contract}
      handleOpenStartContractAlert={mockHandleOpenStartContractAlert}
    />);
    const contractCard = screen.getByText(contract.endDate.toLocaleString(DateTime.DATE_MED));
    expect(contractCard).toBeInTheDocument();
  });

  it('should display frequency', () => {
    render(<ContractCard
      contract={contract}
      handleOpenStartContractAlert={mockHandleOpenStartContractAlert}
    />);
    const contractCard = screen.getByText(convertToSentenceCase(contract.serviceFrequency));
    expect(contractCard).toBeInTheDocument();
  });

  it('should display status', () => {
    render(<ContractCard
      contract={contract}
      handleOpenStartContractAlert={mockHandleOpenStartContractAlert}
    />);
    const contractCard = screen.getByText(convertToSentenceCase(contract.status));
    expect(contractCard).toBeInTheDocument();
  });

  it("should open start contract alert start button is clicked", () => {

    // Given: The contract is inactive, b/c only inactive contracts can be started
    const inactiveContract = contracts[2];
    render(<ContractCard
      contract={inactiveContract}
      handleOpenStartContractAlert={mockHandleOpenStartContractAlert}
    />);

    const startButton = screen.getByRole('button', {name: /start/i});

    // When: the start button is clicked
    fireEvent.click(startButton);

    // Then: the handler should be invoked
    expect(mockHandleOpenStartContractAlert).toBeCalledTimes(1);
    expect(mockHandleOpenStartContractAlert).toBeCalledWith(inactiveContract);

  });

});

