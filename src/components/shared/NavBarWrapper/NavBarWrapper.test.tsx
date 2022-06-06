import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NavBarWrapper from './NavBarWrapper';

describe('<NavBarWrapper />', () => {

  it('opens the drawer when menu is clicked', () => {

    // Given: the NavBar is present on the page
    render(<NavBarWrapper/>);

    // When: the menu button is clicked
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    // Then: the drawer should be open
    expect(screen.getByText('Clients')).toBeInTheDocument();

  });

});