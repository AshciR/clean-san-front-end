import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CancelContractAlert from './CancelContractAlert';
import {ContractStatus, createDefaultContract} from "../../../shared/Contract.model";
import userEvent from "@testing-library/user-event";

describe('<CancelContractAlert />', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHandleCancelContract = jest.fn();
  const mockHandleCloseCancelContractAlert = jest.fn();

  it('should show contract info in alert', () => {

    // Given: We have a contract
    const contract = createDefaultContract();

    // When: The alert is on the screen
    render(<CancelContractAlert
      contract={contract}
      isOpen
      handleCancelContract={mockHandleCancelContract}
      handleCloseCancelContractAlert={mockHandleCloseCancelContractAlert}
    />);

    // Then: The contract info should be in the alert
    expect(screen.getByRole('heading', {name: /cancel contract\?/i})).toBeInTheDocument()

    const expectedMessage = 'Cancelling this contract will cancel all associated not-completed and in-progress services.'

    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it('should cancel contract when confirm is clicked', async () => {

    userEvent.setup();
    const contract = createDefaultContract();

    // Given: The alert is on the screen
    render(<CancelContractAlert
      contract={contract}
      isOpen
      handleCancelContract={mockHandleCancelContract}
      handleCloseCancelContractAlert={mockHandleCloseCancelContractAlert}
    />);

    // When: the confirm button is clicked
    const confirmButton = screen.getByRole('button', {name: /confirm/i});
    await userEvent.click(confirmButton);

    // Then: The contract info should be in the alert
    const cancelledContract = {...contract, status: ContractStatus.CANCELLED}
    expect(mockHandleCancelContract).toBeCalledTimes(1);
    expect(mockHandleCancelContract).toBeCalledWith(cancelledContract);
    expect(mockHandleCloseCancelContractAlert).toBeCalledTimes(1);

  });

  it('should close alert when cancel is clicked', async () => {

    userEvent.setup();
    const contract = createDefaultContract();

    // Given: The alert is on the screen
    render(<CancelContractAlert
      contract={contract}
      isOpen
      handleCancelContract={mockHandleCancelContract}
      handleCloseCancelContractAlert={mockHandleCloseCancelContractAlert}
    />);

    // When: the confirm button is clicked
    const cancelButton = screen.getByRole('button', {name: /cancel/i});
    await userEvent.click(cancelButton);

    // Then: The contract info should be in the alert
    expect(mockHandleCancelContract).not.toBeCalled();
    expect(mockHandleCloseCancelContractAlert).toBeCalledTimes(1);

  });


});