import React, {FC} from 'react';
import {ContractStatus} from "../../../shared/Contract.model";
import {Chip, ChipProps} from "@mui/material";

interface ContractStatusChipProps {
  status: ContractStatus
  isFilled?: boolean
  chipWidth: number
}

const ContractStatusChip: FC<ContractStatusChipProps> = ({status, isFilled, chipWidth}: ContractStatusChipProps) => {

  const chipProps = {
    [ContractStatus.INACTIVE]: {color: 'warning', label: 'Inactive'},
    [ContractStatus.ACTIVE]: {color: 'info', label: 'Active'},
    [ContractStatus.COMPLETED]: {color: 'success', label: 'Completed'},
    [ContractStatus.CANCELLED]: {color: 'default', label: 'Cancelled'},
  };

  return (
    <Chip
      size='small'
      variant={isFilled ? 'filled' : 'outlined'}
      sx={{width: chipWidth}}
      {...chipProps[status] as ChipProps}
    />
  );
};

export default ContractStatusChip;
