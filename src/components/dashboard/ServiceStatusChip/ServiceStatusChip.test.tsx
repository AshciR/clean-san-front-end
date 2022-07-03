import {render, screen} from "@testing-library/react";
import ServiceStatusChip from "./ServiceStatusChip";
import ServiceStatus from "../../../shared/ServiceStatus.model";

describe('<ServiceStatusChip />', () => {

  it('should mount', () => {

    // Given: the chip renders
    render(<ServiceStatusChip status={ServiceStatus.COMPLETED}/>);

    // Expect: the correct status to be there
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

});