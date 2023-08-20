import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddClientForm from './AddClientForm';
import userEvent from "@testing-library/user-event";

describe('<AddClientForm />', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHandleCloseAddClientModal = jest.fn();
  const mockHandleAddClient = jest.fn();

  test('it should submit form successfully', async () => {

    // Given: The form is filled with valid values
    render(<AddClientForm
      handleCloseAddClientModal={mockHandleCloseAddClientModal}
      handleAddClient={mockHandleAddClient}
    />);
    const user = userEvent
    await user.type(screen.getByLabelText(/Company Name/), 'Rick');
    await user.type(screen.getByLabelText(/Primary Contact First Name/), 'Morty');
    await user.type(screen.getByLabelText(/Primary Contact Last Name/), 'Smith');
    await user.type(screen.getByLabelText(/Telephone/), '8761234567');
    await user.type(screen.getByLabelText(/Email/), 'rick@gmail.com');

    // When: We submit the form
    await user.click(screen.getByRole('button', {name: 'Submit'}));

    // Then: The form should be submitted correctly
    await waitFor(() => {
      expect(mockHandleAddClient).toBeCalledWith({
        id: 0,
        name: 'Rick',
        primaryContactFirstName: 'Morty',
        primaryContactLastName: 'Smith',
        telephoneNumber: '8761234567',
        email: 'rick@gmail.com',
        isActive: false
      });
    })

    await waitFor(() => {
      expect(mockHandleCloseAddClientModal).toBeCalledTimes(1);
    });

  });

  test('it should not submit form when required fields are missing', async () => {

    // Given: The form is missing required values
    render(<AddClientForm
      handleCloseAddClientModal={mockHandleCloseAddClientModal}
      handleAddClient={mockHandleAddClient}
    />);
    const user = userEvent

    // When: We submit the form
    await user.click(screen.getByRole('button', {name: 'Submit'}));

    // Then: The error messages should appear
    await waitFor(() => {
      expect(mockHandleAddClient).not.toBeCalled();
    });

    await waitFor(() => {
      expect(mockHandleCloseAddClientModal).not.toBeCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Client Name is required')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Primary Contact First Name is required')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Primary Contact Last Name is required')).toBeInTheDocument();
    });

  });

  test('it should clear form when cancelled', async () => {

    // Given: The form is filled with valid values
    render(<AddClientForm
      handleCloseAddClientModal={mockHandleCloseAddClientModal}
      handleAddClient={mockHandleAddClient}
    />);
    const user = userEvent
    await user.type(screen.getByLabelText(/Company Name/), 'Rick');
    await user.type(screen.getByLabelText(/Primary Contact First Name/), 'Morty');
    await user.type(screen.getByLabelText(/Primary Contact Last Name/), 'Smith');
    await user.type(screen.getByLabelText(/Telephone/), '8761234567');
    await user.type(screen.getByLabelText(/Email/), 'rick@gmail.com');

    // When: We cancel the form
    await user.click(screen.getByRole('button', {name: 'Cancel'}));

    // Then: The form should not be submitted
    await waitFor(() => {
      expect(mockHandleAddClient).not.toBeCalled();
    });

    await waitFor(() => {
      expect(mockHandleCloseAddClientModal).toBeCalledTimes(1);
    });

  });

});