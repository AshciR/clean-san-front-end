import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddContractForm from './AddContractForm';

describe('<AddContractForm />', () => {
  test('it should mount', () => {
    render(<AddContractForm
      handleAddContract={() => {
      }}
      handleCloseAddContractModal={() => {
      }}
    />);

    const addContractForm = screen.getByTestId('AddContractForm');

    expect(addContractForm).toBeInTheDocument();
  });
});