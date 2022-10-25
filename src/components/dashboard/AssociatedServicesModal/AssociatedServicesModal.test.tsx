import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AssociatedServicesModal from './AssociatedServicesModal';
import {AssociatedServicesModalState} from "./associatedServicesModal.reducer";
import {getDueServicesResponse} from "../../../mocks/servicesEndpointResponses";
import {convertServicesQueryResponseToDueService} from "../../../services/services.services";
import {DateTime} from "luxon";

describe('<AssociatedServicesModal />', () => {

  const mockHandleCloseAssociatedServicesModal = jest.fn();

  it('should display the related services', () => {

    // Given: We have associated services
    const contractOneServices = getDueServicesResponse.services
      .map(service => convertServicesQueryResponseToDueService(service))
      .filter(service => service.contract.id === 1);

    const modalState: AssociatedServicesModalState = {
      associatedServices: contractOneServices,
      isFetchError: false,
      isLoading: false,
      isOpen: true
    }

    // When: the modal renders
    render(<AssociatedServicesModal
      modalState={modalState}
      handleCloseAssociatedServicesModal={mockHandleCloseAssociatedServicesModal}
    />);

    // Then: The related services should be shown
    const nonCompletedService = contractOneServices[0];
    const nonCompletedServiceDueDate = screen.getByText(nonCompletedService.dueDate.toLocaleString(DateTime.DATE_MED));
    expect(nonCompletedServiceDueDate).toBeInTheDocument();
    expect(screen.getByText(nonCompletedService.id)).toBeInTheDocument();

    const inProgressService = contractOneServices[1];
    const inProgressServiceDueDate = screen.getByText(inProgressService.dueDate.toLocaleString(DateTime.DATE_MED));
    expect(inProgressServiceDueDate).toBeInTheDocument();
    expect(screen.getByText(inProgressService.id)).toBeInTheDocument();
  });

  it('should highlight the selected service', () => {

    // Given: We have associated services
    const mockAssociatedServices = getDueServicesResponse.services
      .map(service => convertServicesQueryResponseToDueService(service))
      .filter(service => service.contract.id === 1);

    // And: A selected service
    const selectedService = mockAssociatedServices[0];

    const modalState: AssociatedServicesModalState = {
      associatedServices: mockAssociatedServices,
      selectedService: selectedService,
      isFetchError: false,
      isLoading: false,
      isOpen: true
    }

    // When: the modal renders
    render(<AssociatedServicesModal
      modalState={modalState}
      handleCloseAssociatedServicesModal={mockHandleCloseAssociatedServicesModal}
    />);

    // Then: The selected service should be highlighted
    const selectedServiceAvatar = screen.getByTestId('selected-service');
    expect(selectedServiceAvatar.textContent).toBe(selectedService.id.toString())
  });

  it('should display the loading indicator', () => {

    // Given: The associated services haven't loaded yet
    const modalState: AssociatedServicesModalState = {
      associatedServices: [],
      isFetchError: false,
      isLoading: true,
      isOpen: true
    }

    // When: the modal renders
    render(<AssociatedServicesModal
      modalState={modalState}
      handleCloseAssociatedServicesModal={mockHandleCloseAssociatedServicesModal}
    />);

    // Then: The loading indicator should be shown
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

  });

  it('should shows the error message when fail to load', () => {

    // Given: The associated services failed to load yet
    const modalState: AssociatedServicesModalState = {
      associatedServices: [],
      isFetchError: true,
      isLoading: false,
      isOpen: true
    }

    // When: the modal renders
    render(<AssociatedServicesModal
      modalState={modalState}
      handleCloseAssociatedServicesModal={mockHandleCloseAssociatedServicesModal}
    />);

    // Then: The error message should be shown
    expect(screen.getByText("Sorry... we are unable to get the related services at this time.")).toBeInTheDocument();

  });

  it('should close the modal', () => {

    // Given: The modal is open
    const mockAssociatedServices = getDueServicesResponse.services
      .map(service => convertServicesQueryResponseToDueService(service))
      .filter(service => service.contract.id === 1);

    const modalState: AssociatedServicesModalState = {
      associatedServices: mockAssociatedServices,
      isFetchError: false,
      isLoading: false,
      isOpen: true
    };

    render(<AssociatedServicesModal
      modalState={modalState}
      handleCloseAssociatedServicesModal={mockHandleCloseAssociatedServicesModal}
    />);

    // When: we close the modal
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    // Then: The close callback should be trigger
    expect(mockHandleCloseAssociatedServicesModal).toBeCalledTimes(1);
  });

  it('should display the timeline header', () => {

    // Given: We have associated services
    const contractOneServices = getDueServicesResponse.services
      .map(service => convertServicesQueryResponseToDueService(service))
      .filter(service => service.contract.id === 1);

    const modalState: AssociatedServicesModalState = {
      associatedServices: contractOneServices,
      isFetchError: false,
      isLoading: false,
      isOpen: true
    }

    // When: the modal renders
    render(<AssociatedServicesModal
      modalState={modalState}
      handleCloseAssociatedServicesModal={mockHandleCloseAssociatedServicesModal}
    />);

    // Then: The timeline headers should be present
    expect(screen.getByText(/last updated/i)).toBeInTheDocument();
    expect(screen.getByText(/id/i)).toBeInTheDocument();
    expect(screen.getByText(/due date/i)).toBeInTheDocument();

  });

});