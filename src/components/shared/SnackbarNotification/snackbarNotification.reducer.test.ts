import snackbarNotificationReducer, { initialSnackbarNotificationState, SnackbarNotificationAction, SnackbarNotificationState } from "./snackbarNotification.reducer";

describe('Snackbar Notification Reducer', () => {

    test('open snackbar', () => {

        // Given: We have a current state and an action
        const state = initialSnackbarNotificationState
        const message = 'Yay Success!'
        const action: SnackbarNotificationAction = {
            type: 'SNACKBAR_NOTIFICATION_OPEN',
            payload: {
                severity: 'success',
                message: message,
            }
        };

        // When: We call the reducer
        const updatedState = snackbarNotificationReducer(state, action);

        // Then: The expected state should be produdced
        const expectedState: SnackbarNotificationState = {
            isNotificationOpen: true,
            severity: "success",
            message: message
        };

        expect(updatedState).toStrictEqual(expectedState);

    });

    test('close snackbar', () => {

        // Given: The snackbar is open
        const message = "You should save your work";
        const openState: SnackbarNotificationState = {
            isNotificationOpen: true,
            severity: "info",
            message: message
        }

        // And: We have the close action
        const action: SnackbarNotificationAction = {
            type: 'SNACKBAR_NOTIFICATION_CLOSE'
        };

        // When: We call the reducer
        const updatedState = snackbarNotificationReducer(openState, action);

        // Then: The expected state should be produdced
        const expectedState: SnackbarNotificationState = {
            isNotificationOpen: false,
            severity: "info",
            message: message
        };

        expect(updatedState).toStrictEqual(expectedState);

    });
});