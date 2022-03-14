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

});
