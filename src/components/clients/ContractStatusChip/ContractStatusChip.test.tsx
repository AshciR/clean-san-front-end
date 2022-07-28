import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ContractStatusChip from './ContractStatusChip';
import {ContractStatus} from "../../../shared/Contract.model";

describe('<ContractStatusChip />', () => {

  it.each([
    [ContractStatus.COMPLETED, 'Completed'],
    [ContractStatus.INACTIVE, 'Inactive'],
    [ContractStatus.ACTIVE, 'Active'],
    [ContractStatus.CANCELLED, 'Cancelled'],
  ])
  ('%s status should display %s text', (status, expectedText) => {
    render(<ContractStatusChip status={status} chipWidth={150}/>);
    const contractStatusChip = screen.getByText(expectedText);
    expect(contractStatusChip).toBeInTheDocument();
  });

});