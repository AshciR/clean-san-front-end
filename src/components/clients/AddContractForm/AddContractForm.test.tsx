import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddContractForm from './AddContractForm';
import {createDefaultClientWithContracts} from "../../../shared/ClientWithContracts.model";
import userEvent from "@testing-library/user-event";
import {DateTime} from "luxon";
import {ServiceFrequency} from "../../../shared/Contract.model";

describe('<AddContractForm />', () => {

  const mockHandleAddContract = jest.fn();
  const mockHandleCloseAddContractModal = jest.fn();

  beforeEach(() => {
    userEvent.setup()
    jest.clearAllMocks();
  });

  it('submits the form with default values successfully', async () => {

    // Given: The form is on the screen with default values
    const associatedClient = createDefaultClientWithContracts();

    render(<AddContractForm
      associatedClient={associatedClient}
      handleAddContract={mockHandleAddContract}
      handleCloseAddContractModal={mockHandleCloseAddContractModal}
    />);

    // When: The form is submitted
    const submitButton = await screen.findByRole('button', {
      name: /submit/i
    });
    await userEvent.click(submitButton);

    // Then: It's submitted successfully
    await waitFor(() => {
      expect(mockHandleAddContract).toBeCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockHandleAddContract).toBeCalledWith({
        id: 0,
        clientId: associatedClient.id,
        startDate: DateTime.now().set({hour: 0, minute: 0, second: 0, millisecond: 0}),
        // Default the end date to be 1 year (exclusive) from now
        endDate: DateTime.now()
          .plus({year: 1})
          .minus({day: 1})
          .set({hour: 0, minute: 0, second: 0, millisecond: 0}),
        serviceFrequency: "MONTHLY",
        status: "INACTIVE",
      });
    });

  });

  it('submits the form with changed values successfully', async () => {

    // Given: The form is on the screen
    const associatedClient = createDefaultClientWithContracts();

    render(<AddContractForm
      associatedClient={associatedClient}
      handleAddContract={mockHandleAddContract}
      handleCloseAddContractModal={mockHandleCloseAddContractModal}
    />);

    // When: The values are changed
    const dateInputFields = await screen.findAllByRole('textbox', {
      name: /choose date, selected date is .+/i
    });
    const startDateField = dateInputFields[0];
    const endDateField = dateInputFields[1];

    // Change all the fields
    const newStartDate = DateTime.now().minus({day: 1});
    await changeDate(startDateField, newStartDate);

    const newEndDate = DateTime.now().plus({year: 1});
    await changeDate(endDateField, newEndDate);

    fireEvent.change(await screen.findByDisplayValue(ServiceFrequency.MONTHLY), {
      target: {value: ServiceFrequency.FORTNIGHTLY}
    });
    await userEvent.click(await screen.findByRole('button', {name: /submit/i}));

    // Then: It's submitted successfully
    await waitFor(() => {
      expect(mockHandleAddContract).toBeCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockHandleAddContract).toBeCalledWith({
        id: 0,
        clientId: associatedClient.id,
        startDate: newStartDate.set({hour: 0, minute: 0, second: 0, millisecond: 0}),
        endDate: newEndDate.set({hour: 0, minute: 0, second: 0, millisecond: 0}),
        serviceFrequency: "FORTNIGHTLY",
        status: "INACTIVE",
      });
    });

  });

  it('does not submit the form when end date is before the start date', async () => {

    // Given: The form is on the screen
    const associatedClient = createDefaultClientWithContracts();

    render(<AddContractForm
      associatedClient={associatedClient}
      handleAddContract={mockHandleAddContract}
      handleCloseAddContractModal={mockHandleCloseAddContractModal}
    />);

    // When: The values are changed
    const dateInputFields = await screen.findAllByRole('textbox', {
      name: /choose date, selected date is .+/i
    });
    const startDateField = dateInputFields[0];
    const endDateField = dateInputFields[1];

    // End date is before start date
    const newStartDate = DateTime.now().minus({day: 1});
    await changeDate(startDateField, newStartDate);

    const newEndDate = DateTime.now().minus({day: 2});
    await changeDate(endDateField, newEndDate);

    await userEvent.click(await screen.findByRole('button', {name: /submit/i}));

    // Then: It's not submitted
    await waitFor(() => {
      expect(mockHandleAddContract).not.toBeCalled();
    });

    expect(await screen.findByText(/end date must be after start date/i)).toBeInTheDocument();

  });

  it('cancel button closes the form', async () => {

    // Given: The form is on the screen
    const associatedClient = createDefaultClientWithContracts();

    render(<AddContractForm
      associatedClient={associatedClient}
      handleAddContract={mockHandleAddContract}
      handleCloseAddContractModal={mockHandleCloseAddContractModal}
    />);

    // When: The cancel button is clicked
    await userEvent.click(await screen.findByRole('button', {name: /cancel/i}));

    // Then: The modal is closed
    await waitFor(() => {
      expect(mockHandleCloseAddContractModal).toBeCalledTimes(1);
    });

  });

  async function changeDate(startDateInputField: HTMLElement, newDate: DateTime) {

    // Need to type something in the input field to start the process 10/14/1983
    await userEvent.type(startDateInputField, newDate.toLocaleString(DateTime.DATE_SHORT)); // we can type anything

    // We have to switch to the year, in case the dropdown doesn't show it
    await userEvent.click(screen.getByRole('button', {name: /calendar view is open, switch to year view/i}))
    await userEvent.click(screen.getByRole('button', {name: newDate.year.toString()}))

    // The aria-label for the date buttons look like this Oct 14, 1983
    const chosenDate = screen.getByRole('button', {name: newDate.toLocaleString(DateTime.DATE_MED)});
    await userEvent.click(chosenDate);

    // There's an invisible ok button that needs to be clicked
    await userEvent.click(screen.getByRole('button', {name: /ok/i}));
  }

});