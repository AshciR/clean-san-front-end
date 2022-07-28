import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ServiceFrequencyChip from './ServiceFrequencyChip';
import {ServiceFrequency} from "../../../shared/Contract.model";
import {convertToSentenceCase} from "../../../setupTests";

describe('<ServiceFrequencyChip />', () => {
  it('should display correct frequency', () => {
    render(<ServiceFrequencyChip frequency={ServiceFrequency.MONTHLY}/>);
    const serviceFrequencyChip = screen.getByText(convertToSentenceCase(ServiceFrequency.MONTHLY));
    expect(serviceFrequencyChip).toBeInTheDocument();
  });
});