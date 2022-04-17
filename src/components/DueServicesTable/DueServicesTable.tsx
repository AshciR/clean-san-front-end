import {
  Box, Chip, ChipProps, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from '@mui/material';
import { DateTime } from 'luxon';
import { FC } from 'react';
import DueService from '../../shared/DueService.model';
import ServiceStatus from '../../shared/ServiceStatus.model';
import styles from './DueServicesTable.module.scss';

interface DueServicesTableProps {
  dueServices: Array<DueService>
  handleChangeServiceStatus: ((event: SelectChangeEvent<ServiceStatus>) => void) | undefined
};

const DueServicesTable: FC<DueServicesTableProps> = ({ dueServices, handleChangeServiceStatus }: DueServicesTableProps) => {

  const hasServices = dueServices.length !== 0;

  return (
    <div className={styles.DueServicesTable} data-testid="due-services-table">
      {hasServices ? <VisableDueServiceTable services={dueServices} handleChangeServiceStatus={handleChangeServiceStatus} /> : <NoDueServicesDisplay />}
    </div>
  );
};

interface VisableDueServiceTableProps {
  services: Array<DueService>
  handleChangeServiceStatus: ((event: SelectChangeEvent<ServiceStatus>) => void) | undefined
};

const VisableDueServiceTable = ({ services, handleChangeServiceStatus }: VisableDueServiceTableProps) => (
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
        {services.map(service => <DueServiceRow key={service.id} service={service} handleChangeServiceStatus={handleChangeServiceStatus} />)}
      </TableBody>
    </Table>
  </TableContainer>
);

interface DueServiceRowProps {
  service: DueService
  handleChangeServiceStatus: ((event: SelectChangeEvent<ServiceStatus>) => void) | undefined
};

const DueServiceRow = ({ service, handleChangeServiceStatus }: DueServiceRowProps) => (
  <TableRow data-testid="due-service-table-row">
    <TableCell>{service.id}</TableCell>
    <TableCell align='right'>{service.client.name}</TableCell>
    <TableCell align='right'>{service.contract.serviceFrequency}</TableCell>
    <TableCell align='right'>{service.dueDate.toLocaleString(DateTime.DATE_MED)}</TableCell>
    <TableCell align='right'>
      <ServiceStatusChip status={service.currentStatus} />
    </TableCell>
    <TableCell align='right'>
      <StatusDropDown newStatus={service.currentStatus} handleChangeServiceStatus={handleChangeServiceStatus} />
    </TableCell>
  </TableRow>
)

const NoDueServicesDisplay = () => (
  <Typography variant='h5' data-testid="no-due-services-display">There are no due services at this time</Typography>
);


interface StatusDropDownProps {
  newStatus: ServiceStatus
  // TODO: I think this needs to take a <DueService> instead of a <ServiceStatus>
  handleChangeServiceStatus: ((event: SelectChangeEvent<ServiceStatus>) => void) | undefined
};

const StatusDropDown = ({ newStatus, handleChangeServiceStatus }: StatusDropDownProps) => {
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="new-status-select-label">New Status</InputLabel>
        <Select
          labelId="new-status-select-label"
          id="new-staus-select"
          value={newStatus}
          label="New Status"
          onChange={handleChangeServiceStatus}
          renderValue={selected => <ServiceStatusChip status={selected}></ServiceStatusChip>}
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

interface ServiceStatusChipProps {
  status: ServiceStatus
};

const ServiceStatusChip = ({ status }: ServiceStatusChipProps) => {

  const chipProps = {
    [ServiceStatus.NOT_COMPLETED]: { color: 'warning', label: 'Not Completed' },
    [ServiceStatus.IN_PROGRESS]: { color: 'info', label: 'In Progress' },
    [ServiceStatus.COMPLETED]: { color: 'success', label: 'Completed' },
    [ServiceStatus.CANCELLED]: { color: 'default', label: 'Cancelled' },
  };

  return <Chip size='small' variant='outlined' {...chipProps[status] as ChipProps} />

};

export default DueServicesTable;


