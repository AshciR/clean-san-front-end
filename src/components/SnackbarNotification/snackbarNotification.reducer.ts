interface SnackbarNotificationState {
    isNotificationOpen: boolean;
    severity: 'success' | 'info' | 'error' | 'warning';
    message: string;
};

const initialSnackbarNotificationState: SnackbarNotificationState = {
    isNotificationOpen: false,
    severity: "success",
    message: ""
};

interface SnackbarNotificationOpenAction {
    type: 'SNACKBAR_NOTIFICATION_OPEN';
    payload: {
        severity: 'success' | 'info' | 'error' | 'warning';
        message: string
    }
};

interface SnackbarNotificationCloseAction {
    type: 'SNACKBAR_NOTIFICATION_CLOSE';
};

type SnackbarNotificationAction =
    | SnackbarNotificationOpenAction
    | SnackbarNotificationCloseAction

const snackbarNotificationReducer = (state: SnackbarNotificationState, action: SnackbarNotificationAction) => {

    switch (action.type) {
        case 'SNACKBAR_NOTIFICATION_OPEN':
            const snackbarNotificationOpenState: SnackbarNotificationState = {
                isNotificationOpen: true,
                ...action.payload
            }
            return snackbarNotificationOpenState;
        case 'SNACKBAR_NOTIFICATION_CLOSE':
            const snackbarNotificationCloseState: SnackbarNotificationState = {
                isNotificationOpen: false,
                severity: state.severity,
                message: state.message
            }
            return snackbarNotificationCloseState;
        default:
            throw new Error(`Illegal Dashboard action was provided`);

    }

}

export default snackbarNotificationReducer
export { initialSnackbarNotificationState, snackbarNotificationReducer };
export type { SnackbarNotificationAction, SnackbarNotificationState }