import ServiceStatus from "../../../shared/ServiceStatus.model";
import {Chip, ChipProps} from "@mui/material";

const STATUS_CHIP_WIDTH = 120;

interface ServiceStatusChipProps {
  status: ServiceStatus
  isFilled?: boolean
}

const ServiceStatusChip = ({status, isFilled}: ServiceStatusChipProps) => {

  const chipProps = {
    [ServiceStatus.NOT_COMPLETED]: {color: 'warning', label: 'Not Completed'},
    [ServiceStatus.IN_PROGRESS]: {color: 'info', label: 'In Progress'},
    [ServiceStatus.COMPLETED]: {color: 'success', label: 'Completed'},
    [ServiceStatus.CANCELLED]: {color: 'default', label: 'Cancelled'},
  };

  return <Chip
    size='small'
    variant={isFilled ? 'filled' : 'outlined'}
    sx={{width: STATUS_CHIP_WIDTH}}
    {...chipProps[status] as ChipProps} />

};

export default ServiceStatusChip
export {STATUS_CHIP_WIDTH}