import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NavBar from './NavBar';

describe('<NavBar />', () => {

  it('displays the correct title', () => {

    // Given: we have a title for the nav bar
    const title = 'Dashboard';

    // When: the nav bar is rendered
    render(<NavBar title={title}/>);

    // Then: The title should be displayed
    expect(screen.getByText(title).textContent).toBe(title);
  });

  it('displays the link to the home page', () => {

    // Given: we have a title for the nav bar
    const title = 'Dashboard';

    // When: the nav bar is rendered
    render(<NavBar title={title}/>);
    const homeLink = screen.getByText('CLEANSAN')

    // Then: The link to the home page should be displayed
    expect(homeLink.getAttribute('href')).toBe('/');
  });

});