import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NavBar from './NavBar';

describe('<NavBar />', () => {

  const mockOnOpenDrawer = jest.fn(() => {
  });

  const mockOnCloseDrawer = jest.fn(() => {
  });

  it('displays the correct title', () => {

    // Given: we have a title for the nav bar
    const title = 'Dashboard';

    // When: the nav bar is rendered
    render(
      <NavBar
        title={title}
        menuDrawerOpen={false}
        onOpenDrawer={mockOnOpenDrawer}
        onCloseDrawer={mockOnCloseDrawer}
      />);

    // Then: The title should be displayed
    expect(screen.getByText(title).textContent).toBe(title);
  });

  it('displays the link to the home page', () => {

    // Given: we have a title for the nav bar
    const title = 'Dashboard';

    // When: the nav bar is rendered
    render(<NavBar
      title={title}
      menuDrawerOpen={false}
      onOpenDrawer={mockOnOpenDrawer}
      onCloseDrawer={mockOnCloseDrawer}
    />);

    const homeLink = screen.getByText('CLEANSAN')

    // Then: The link to the home page should be displayed
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  it('opens the drawer when the menu button is clicked', () => {

    // Given: The NavBar is present
    render(<NavBar
      title={'Dashboard'}
      menuDrawerOpen={false}
      onOpenDrawer={mockOnOpenDrawer}
      onCloseDrawer={mockOnCloseDrawer}
    />);

    // When: the menu button is clicked
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    // Then: The onOpen function should be called
    expect(mockOnOpenDrawer).toHaveBeenCalledTimes(1);
  });

});