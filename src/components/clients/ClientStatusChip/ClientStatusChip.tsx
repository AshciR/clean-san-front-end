import React, {FC} from 'react';
import {Chip} from "@mui/material";

interface ClientStatusChipProps {
  isActive: boolean
  chipWidth: number
}

const ClientStatusChip: FC<ClientStatusChipProps> = ({isActive, chipWidth}: ClientStatusChipProps) => (
  isActive ? <Chip
    size='small'
    variant='outlined'
    sx={{width: chipWidth}}
    color='success'
    label='Active'
  /> : <Chip
    size='small'
    variant='outlined'
    sx={{width: chipWidth}}
    color='error'
    label='Inactive'
  />
);

export default ClientStatusChip;
