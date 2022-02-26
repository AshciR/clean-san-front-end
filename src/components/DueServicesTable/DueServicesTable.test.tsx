import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DueServicesTable from './DueServicesTable';

describe('<DueServicesTable />', () => {
  test('it should mount', () => {
    render(<DueServicesTable dueServices={[]} />);
    
    const dueServicesTable = screen.getByTestId('DueServicesTable');

    expect(dueServicesTable).toBeInTheDocument();
  });
});