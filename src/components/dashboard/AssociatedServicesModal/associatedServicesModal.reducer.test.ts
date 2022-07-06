import {
  AssociatedServicesAction,
  AssociatedServicesModalState,
  associatedServicesReducer,
  initialAssociatedServicesModalState
} from "./associatedServicesModal.reducer";
import {getDueServicesResponse} from "../../../mocks/servicesEndpointResponses";
import {convertDueServicesResponseToDueService} from "../../../services/services.services";

describe('AssociatedServicesModal Reducer', () => {

  const mockAssociatedServices = getDueServicesResponse.dueServices
    .map(service => convertDueServicesResponseToDueService(service))
    .filter(service => service.contract.id === 1);

  it('init fetching associated services', () => {

    // Given: We have a current state and an action
    const state = initialAssociatedServicesModalState
    const action: AssociatedServicesAction = {
      type: "ASSOCIATED_SERVICES_FETCH_INIT"
    };

    // When: We call the reducer
    const updatedState = associatedServicesReducer(state, action);

    // Then: The expected state should be produced
    const expectedState: AssociatedServicesModalState = {
      isOpen: true,
      associatedServices: [],
      selectedService: undefined,
      isLoading: true,
      isFetchError: false
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('select service for other associated services', () => {

    // Given: We have a current state and an action
    const state: AssociatedServicesModalState = {
      isOpen: true,
      associatedServices: mockAssociatedServices,
      isFetchError: false,
      isLoading: false,
    }
    const serviceOfInterest = mockAssociatedServices[0];
    const action: AssociatedServicesAction = {
      type: "ASSOCIATED_SERVICES_SELECT_SERVICE",
      payload: serviceOfInterest
    };

    // When: We call the reducer
    const updatedState = associatedServicesReducer(state, action);

    // Then: The expected state should be produced
    const expectedState: AssociatedServicesModalState = {
      isOpen: true,
      associatedServices: mockAssociatedServices,
      selectedService: serviceOfInterest,
      isLoading: false,
      isFetchError: false
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('fetches associated services successfully', () => {

    // Given: We have a current state and an action
    const state: AssociatedServicesModalState = {
      isOpen: true,
      associatedServices: [],
      isFetchError: false,
      isLoading: true,
    }
    const action: AssociatedServicesAction = {
      type: "ASSOCIATED_SERVICES_FETCH_SUCCESS",
      payload: mockAssociatedServices
    };

    // When: We call the reducer
    const updatedState = associatedServicesReducer(state, action);

    // Then: The expected state should be produced
    const expectedState: AssociatedServicesModalState = {
      isOpen: true,
      associatedServices: mockAssociatedServices,
      isLoading: false,
      isFetchError: false
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('closes the modal', () => {

    // Given: We have a current state and an action
    const serviceOfInterest = mockAssociatedServices[0];
    const state: AssociatedServicesModalState = {
      isOpen: true,
      associatedServices: mockAssociatedServices,
      isFetchError: false,
      isLoading: false,
      selectedService: serviceOfInterest
    }
    const action: AssociatedServicesAction = {
      type: "ASSOCIATED_SERVICES_CLOSE_MODAL"
    };

    // When: We call the reducer
    const updatedState = associatedServicesReducer(state, action);

    // Then: The expected state should be produced
    const expectedState: AssociatedServicesModalState = {
      isOpen: false,
      associatedServices: [],
      selectedService: undefined,
      isLoading: false,
      isFetchError: false
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  it('fails to fetch associated services', () => {

    // Given: We have a current state and an action
    const state = initialAssociatedServicesModalState
    const action: AssociatedServicesAction = {
      type: "ASSOCIATED_SERVICES_FETCH_FAILURE"
    };

    // When: We call the reducer
    const updatedState = associatedServicesReducer(state, action);

    // Then: The expected state should be produced
    const expectedState: AssociatedServicesModalState = {
      isOpen: false,
      associatedServices: [],
      selectedService: undefined,
      isLoading: false,
      isFetchError: true
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

});