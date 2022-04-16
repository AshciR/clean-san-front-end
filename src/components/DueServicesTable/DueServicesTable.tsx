import {
  Box, Chip, ChipProps, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from '@mui/material';
import { DateTime } from 'luxon';
import { FC, ReactNode } from 'react';
import DueService from '../../shared/DueService.model';
import ServiceStatus from '../../shared/ServiceStatus.model';
import styles from './DueServicesTable.module.scss';

interface DueServicesTableProps {
  dueServices: Array<DueService>
};

const DueServicesTable: FC<DueServicesTableProps> = ({ dueServices }: DueServicesTableProps) => {

  const hasServices = dueServices.length !== 0;

  return (
    <div className={styles.DueServicesTable} data-testid="due-services-table">
      {hasServices ? <VisableDueServiceTable services={dueServices} /> : <NoDueServicesDisplay />}
    </div>
  );
};

interface VisableDueServiceTableProps {
  services: Array<DueService>
};

const VisableDueServiceTable = ({ services }: VisableDueServiceTableProps) => (
  <TableContainer data-testid="visable-due-services-table">
    <Table aria-label="due services table">
      <TableHead>
        <TableRow>
          <TableCell>Id</TableCell>
          <TableCell align='right'>Client</TableCell>
          <TableCell align='right'>Frequency</TableCell>
          <TableCell align='right'>Due Date</TableCell>
          <TableCell align='right'>Current Status</TableCell>
          <TableCell align='right'>New Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {services.map(service => <DueServiceRow key={service.id} service={service} />)}
      </TableBody>
    </Table>
  </TableContainer>
);

interface DueServiceRowProps {
  service: DueService
};

const DueServiceRow = ({ service }: DueServiceRowProps) => (
  <TableRow data-testid="due-service-table-row">
    <TableCell>{service.id}</TableCell>
    <TableCell align='right'>{service.client.name}</TableCell>
    <TableCell align='right'>{service.contract.serviceFrequency}</TableCell>
    <TableCell align='right'>{service.dueDate.toLocaleString(DateTime.DATE_MED)}</TableCell>
    <TableCell align='right'>
      <ServiceStatusChip status={service.currentStatus} />
    </TableCell>
    <TableCell align='right'>
      <StatusDropDown newStatus={service.currentStatus} handleChangeStatus={() => { }} />
    </TableCell>
  </TableRow>
)

const NoDueServicesDisplay = () => (
  <Typography variant='h5' data-testid="no-due-services-display">There are no due services at this time</Typography>
);

interface ServiceStatusBadgeProps {
  status: ServiceStatus
};

const ServiceStatusChip = ({ status }: ServiceStatusBadgeProps) => {

  const chipProps = {
    [ServiceStatus.NOT_COMPLETED]: { color: 'warning', label: 'Not Completed' },
    [ServiceStatus.IN_PROGRESS]: { color: 'info', label: 'In Progress' },
    [ServiceStatus.COMPLETED]: { color: 'success', label: 'Completed' },
    [ServiceStatus.CANCELLED]: { color: 'default', label: 'Cancelled' },
  };

  return <Chip size='small' variant='outlined' {...chipProps[status] as ChipProps} />

};

interface StatusDropDownProps {
  newStatus: ServiceStatus
  handleChangeStatus: ((event: SelectChangeEvent<ServiceStatus>, child: ReactNode) => void) | undefined
};

const StatusDropDown = ({ newStatus, handleChangeStatus }: StatusDropDownProps) => {
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="new-status-select-label">New Status</InputLabel>
        <Select
          labelId="new-status-select-label"
          id="new-staus-select"
          value={newStatus}
          label="New Status"
          onChange={handleChangeStatus}
          renderValue={(selected) => (
            <ServiceStatusChip status={newStatus}></ServiceStatusChip>
          )}
          variant='outlined'
        >
          <MenuItem key={ServiceStatus.NOT_COMPLETED} value={ServiceStatus.NOT_COMPLETED}>
            <ServiceStatusChip status={ServiceStatus.NOT_COMPLETED}></ServiceStatusChip>
          </MenuItem>
          <MenuItem key={ServiceStatus.IN_PROGRESS} value={ServiceStatus.IN_PROGRESS}>
            <ServiceStatusChip status={ServiceStatus.IN_PROGRESS}></ServiceStatusChip>
          </MenuItem>
          <MenuItem key={ServiceStatus.COMPLETED} value={ServiceStatus.COMPLETED}>
            <ServiceStatusChip status={ServiceStatus.COMPLETED}></ServiceStatusChip>
          </MenuItem>
          <MenuItem key={ServiceStatus.CANCELLED} value={ServiceStatus.CANCELLED}>
            <ServiceStatusChip status={ServiceStatus.CANCELLED}></ServiceStatusChip>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default DueServicesTable;


