import {render, screen} from "@testing-library/react";
import DrawerMenuItems from "./DrawerMenuItems";
import {MemoryRouter} from "react-router-dom";

describe('<DrawerMenuItems />', () => {

  it('should contain all of the menu items', () => {

    // Given: We know all the menu items
    const menuItems = [
      'Dashboard',
      'Clients',
      'Services'
    ];

    // When: The component renders
    render(<DrawerMenuItems/>, {wrapper: MemoryRouter});

    // Then: All the menu items should be present
    menuItems.forEach(item => {
      const menuItem = screen.getByText(item);
      expect(menuItem).toBeInTheDocument();
    });

  });

})