import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SnackbarNotification from './SnackbarNotification';

describe('<SnackbarNotification />', () => {

  test('it contain the notifcation message', () => {

    // When: The snackbar is rendered
    const message = 'Test message'

    render(
      <SnackbarNotification
        open={true}
        handleClose={() => undefined}
        severity={'success'}
        message={message}
      />
    );

    // Then: The snackbar should have the correct text message
    const snackbarNotification = screen.getByText('Test message');
    expect(snackbarNotification).toBeInTheDocument();
    expect(snackbarNotification.textContent).toBe(message);
  });

});