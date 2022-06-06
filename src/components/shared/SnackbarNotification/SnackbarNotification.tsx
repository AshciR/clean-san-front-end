import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { FC } from 'react';

interface SnackbarNotificationProps {
  open: boolean,
  handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void,
  autoHideDuration?: number
  severity: 'success' | 'info' | 'error' | 'warning'
  message: string
}

const SnackbarNotification: FC<SnackbarNotificationProps> = ({
  open,
  handleClose,
  autoHideDuration = 6000,
  severity, message
}: SnackbarNotificationProps) => (

  <Snackbar
    open={open}
    autoHideDuration={autoHideDuration}
    onClose={handleClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
  >
    <MuiAlert
      onClose={handleClose}
      severity={severity}
      variant='standard'
      elevation={3}
    >
      {message}
    </MuiAlert>
  </Snackbar>

);

export default SnackbarNotification;
