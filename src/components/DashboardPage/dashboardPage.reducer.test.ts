import DueService from "../../shared/DueService.model";
import ServiceStatus from "../../shared/ServiceStatus.model";
import MOCK_DUE_SERVICES from "../DueServicesTable/MockDueServicesData";
import dueServicesReducer, { DashboardAction, initialDueServicesState } from "./dashboardPage.reducer";


describe('DashboardPage Reducer', () => {

    test('init fetching due services', () => {

        // Given: We have a current state and an action
        const state = initialDueServicesState
        const action: DashboardAction = {
            type: 'DUE_SERVICES_FETCH_INIT'
        };

        // When: We call the reducer
        const updatedState = dueServicesReducer(state, action);

        // Then: The expected state should be produdced
        const expectedState = {
            dueServices: [],
            isLoading: true,
            isError: false
        };

        expect(updatedState).toStrictEqual(expectedState);

    });

    test('fetches due services successfully from initial state', () => {

        // Given: We have a current state and an action
        const state = initialDueServicesState
        const action: DashboardAction = {
            type: 'DUE_SERVICES_FETCH_SUCCESS',
            payload: MOCK_DUE_SERVICES
        };

        // When: We call the reducer
        const updatedState = dueServicesReducer(state, action);

        // Then: The expected state should be produdced
        const expectedState = {
            dueServices: MOCK_DUE_SERVICES,
            isLoading: false,
            isError: false
        };

        expect(updatedState).toStrictEqual(expectedState);

    });

    test('fails to fetch due services from initial state', () => {

        // Given: We have a current state and an action
        const state = initialDueServicesState
        const action: DashboardAction = {
            type: 'DUE_SERVICES_FETCH_FAILURE'
        };

        // When: We call the reducer
        const updatedState = dueServicesReducer(state, action);

        // Then: The expected state should be produdced
        const expectedState = {
            dueServices: [],
            isLoading: false,
            isError: true
        };

        expect(updatedState).toStrictEqual(expectedState);

    });

    test('clears existing due services when it fails to fetch due services', () => {

        // Given: We have previously successfully fetched due services
        const state = initialDueServicesState
        const successAction: DashboardAction = {
            type: 'DUE_SERVICES_FETCH_SUCCESS',
            payload: MOCK_DUE_SERVICES
        };

        const stateWithDueServices = dueServicesReducer(state, successAction);

        // When: We fail the second fetch call
        const failAction: DashboardAction = {
            type: 'DUE_SERVICES_FETCH_FAILURE'
        };
        const updatedState = dueServicesReducer(stateWithDueServices, failAction);

        // Then: The expected state should be produdced
        const expectedState = {
            dueServices: [],
            isLoading: false,
            isError: true
        };

        expect(updatedState).toStrictEqual(expectedState);

    });

    test('should update the new status of the service ', () => {

        // Given: We have due services
        const currentState = {
            dueServices: MOCK_DUE_SERVICES,
            isLoading: false,
            isError: false
        };

        // And: We have the service we want to update
        const updatedService: DueService = {
            ...MOCK_DUE_SERVICES[0],
            prospectiveStatus: ServiceStatus.IN_PROGRESS
        }

        const updateAction: DashboardAction = {
            type: 'DUE_SERVICES_UPDATE_SERVICE',
            payload: updatedService
        };

        // When: We call the update action
        const updatedState = dueServicesReducer(currentState, updateAction);

        // Then: The expected state should be produdced
        const expectedState = {
            dueServices: [updatedService, ...MOCK_DUE_SERVICES.slice(1)],
            isLoading: false,
            isError: false
        };

        expect(updatedState).toStrictEqual(expectedState);

    });

    test('should update the new status of the service while preserving the order ', () => {

        // Given: We have due services
        const currentState = {
            dueServices: MOCK_DUE_SERVICES,
            isLoading: false,
            isError: false
        };

        // And: We we want to update the 3rd service
        const updatedServiceIndex = 2;
        const updatedService: DueService = {
            ...MOCK_DUE_SERVICES[updatedServiceIndex],
            prospectiveStatus: ServiceStatus.IN_PROGRESS
        }

        const updateAction: DashboardAction = {
            type: 'DUE_SERVICES_UPDATE_SERVICE',
            payload: updatedService
        };

        // When: We call the update action
        const updatedState = dueServicesReducer(currentState, updateAction);

        // Then: The expected state should be produdced
        const expectedState = {
            dueServices: [
                ...MOCK_DUE_SERVICES.slice(0, updatedServiceIndex),
                updatedService,
                ...MOCK_DUE_SERVICES.slice(updatedServiceIndex + 1)
            ],
            isLoading: false,
            isError: false
        };

        expect(updatedState).toStrictEqual(expectedState);
    });

});
