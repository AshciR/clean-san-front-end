import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NavBarWrapper from './NavBarWrapper';
import {MemoryRouter} from "react-router-dom";

describe('<NavBarWrapper />', () => {

  it('the app bar title is displayed', () => {

    // Given: the NavBar is present on the page
    render(<NavBarWrapper title={'Sample Title'}/>, {wrapper: MemoryRouter});

    // Then: the title should be on the app bar
    expect(screen.getByText('Sample Title')).toBeInTheDocument();

  });


  it('opens the drawer when menu is clicked', () => {

    // Given: the NavBar is present on the page
    render(<NavBarWrapper title={'Sample Title'}/>, {wrapper: MemoryRouter});

    // When: the menu button is clicked
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    // Then: the drawer should be open
    expect(screen.getByText('Clients')).toBeInTheDocument();

  });

});