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
            isLoading: true
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
            isLoading: false
        };

        expect(updatedState).toStrictEqual(expectedState);

    });

});
