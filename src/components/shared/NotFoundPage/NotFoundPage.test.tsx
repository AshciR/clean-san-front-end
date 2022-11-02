import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NotFoundPage from './NotFoundPage';
import {MemoryRouter} from "react-router-dom";

describe('<NotFoundPage />', () => {
  it('should have the relevant content', () => {
    render(<NotFoundPage/>, {wrapper: MemoryRouter});

    expect(screen.getByText(/whoops/i)).toBeInTheDocument();
    expect(screen.getByText(/the page you are looking for was not found/i)).toBeInTheDocument();
    expect(screen.getByRole('img', {name: /not found/i})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /back to/i})).toBeInTheDocument();
  });
});