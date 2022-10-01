import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StartContractAlert from './StartContractAlert';
import {createDefaultContract} from "../../../shared/Contract.model";
import {convertToSentenceCase} from "../../../setupTests";
import {DateTime} from "luxon";
import userEvent from "@testing-library/user-event";

describe('<StartContractAlert />', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHandleStartContract = jest.fn();
  const mockHandleCloseStartContractAlert = jest.fn();

  it('should show contract info in alert', () => {

    // Given: We have a contract
    const contract = createDefaultContract();

    // When: The alert is on the screen
    render(<StartContractAlert
      contract={contract}
      isOpen
      handleStartContract={mockHandleStartContract}
      handleCloseStartContractAlert={mockHandleCloseStartContractAlert}
    />);

    // Then: The contract info should be in the alert
    expect(screen.getByRole('heading', {name: /start contract\?/i})).toBeInTheDocument()

    const expectedMessage = `Starting this contract will create ` +
      `${convertToSentenceCase(contract.serviceFrequency)} services for the client from ` +
      `${contract.startDate.toLocaleString(DateTime.DATE_MED)} until ${contract.endDate.toLocaleString(DateTime.DATE_MED)}.`

    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it('should start contract when confirm is clicked', async () => {

    userEvent.setup();
    const contract = createDefaultContract();

    // Given: The alert is on the screen
    render(<StartContractAlert
      contract={contract}
      isOpen
      handleStartContract={mockHandleStartContract}
      handleCloseStartContractAlert={mockHandleCloseStartContractAlert}
    />);

    // When: the confirm button is clicked
    const confirmButton = screen.getByRole('button', {name: /confirm/i});
    await userEvent.click(confirmButton);

    // Then: The contract info should be in the alert
    expect(mockHandleStartContract).toBeCalledTimes(1);
    expect(mockHandleStartContract).toBeCalledWith(contract);
    expect(mockHandleCloseStartContractAlert).toBeCalledTimes(1);

  });

  it('should close alert when cancel is clicked', async () => {

    userEvent.setup();
    const contract = createDefaultContract();

    // Given: The alert is on the screen
    render(<StartContractAlert
      contract={contract}
      isOpen
      handleStartContract={mockHandleStartContract}
      handleCloseStartContractAlert={mockHandleCloseStartContractAlert}
    />);

    // When: the confirm button is clicked
    const cancelButton = screen.getByRole('button', {name: /cancel/i});
    await userEvent.click(cancelButton);

    // Then: The contract info should be in the alert
    expect(mockHandleStartContract).not.toBeCalled();
    expect(mockHandleCloseStartContractAlert).toBeCalledTimes(1);

  });


});