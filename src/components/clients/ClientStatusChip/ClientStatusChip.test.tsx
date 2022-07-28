import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ClientStatusChip from './ClientStatusChip';

describe('<ClientStatusChip />', () => {

  test('it should display active status', () => {
    render(<ClientStatusChip isActive chipWidth={150}/>);
    const clientStatusChip = screen.getByText('Active');
    expect(clientStatusChip).toBeInTheDocument();
  });

  test('it should display inactive status', () => {
    render(<ClientStatusChip isActive={false} chipWidth={150}/>);
    const clientStatusChip = screen.getByText('Inactive');
    expect(clientStatusChip).toBeInTheDocument();
  });

});