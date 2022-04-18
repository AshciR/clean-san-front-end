import {
  Box, Chip, ChipProps, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from '@mui/material';
import { DateTime } from 'luxon';
import { FC } from 'react';
import DueService from '../../shared/DueService.model';
import ServiceStatus, { ServiceStatusKeys } from '../../shared/ServiceStatus.model';
import styles from './DueServicesTable.module.scss';

interface DueServicesTableProps {
  dueServices: Array<DueService>
  handleUpdateService: (updatedService: DueService) => void
};

const DueServicesTable: FC<DueServicesTableProps> = ({ dueServices, handleUpdateService }: DueServicesTableProps) => {

  const hasServices = dueServices.length !== 0;

  return (
    <div className={styles.DueServicesTable} data-testid="due-services-table">
      {hasServices ? <VisableDueServiceTable services={dueServices} handleUpdateService={handleUpdateService} /> : <NoDueServicesDisplay />}
    </div>
  );
};

interface VisableDueServiceTableProps {
  services: Array<DueService>
  handleUpdateService: (updatedService: DueService) => void
};

const VisableDueServiceTable = ({ services, handleUpdateService }: VisableDueServiceTableProps) => (
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
        {services.map(service => <DueServiceRow key={service.id} service={service} handleUpdateService={handleUpdateService} />)}
      </TableBody>
    </Table>
  </TableContainer>
);

interface DueServiceRowProps {
  service: DueService
  handleUpdateService: (updatedService: DueService) => void
};

const DueServiceRow = ({ service, handleUpdateService }: DueServiceRowProps) => (
  <TableRow data-testid="due-service-table-row">
    <TableCell>{service.id}</TableCell>
    <TableCell align='right'>{service.client.name}</TableCell>
    <TableCell align='right'>{service.contract.serviceFrequency}</TableCell>
    <TableCell align='right'>{service.dueDate.toLocaleString(DateTime.DATE_MED)}</TableCell>
    <TableCell align='right'>
      <ServiceStatusChip status={service.currentStatus} />
    </TableCell>
    <TableCell align='right'>
      <StatusDropDown serviceToBeUpdated={service} handleUpdateService={handleUpdateService} />
    </TableCell>
  </TableRow>
)

const NoDueServicesDisplay = () => (
  <Typography variant='h5' data-testid="no-due-services-display">There are no due services at this time</Typography>
);


interface StatusDropDownProps {
  serviceToBeUpdated: DueService
  handleUpdateService: (updatedService: DueService) => void
};

const StatusDropDown = ({ serviceToBeUpdated, handleUpdateService }: StatusDropDownProps) => {
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="new-status-select-label">Change Status</InputLabel>
        <Select
          labelId="new-status-select-label"
          id="new-staus-select"
          value={serviceToBeUpdated.prospectiveStatus}
          label="New Status"
          onChange={(event) => {
            const updatedService = {
              ...serviceToBeUpdated,
              prospectiveStatus: ServiceStatus[event.target.value as ServiceStatusKeys] // TODO: Figure out why this doesn't work
            };
            handleUpdateService(updatedService)
          }}
          renderValue={updatedServiceStatus => <ServiceStatusChip status={updatedServiceStatus || serviceToBeUpdated.currentStatus} />}
          variant='outlined'
        >
          {/* TODO: Figure out how to map() this value */}
          <MenuItem key={ServiceStatus.NOT_COMPLETED} value={ServiceStatus.NOT_COMPLETED}>
            <ServiceStatusChip status={ServiceStatus.NOT_COMPLETED} />
          </MenuItem>
          <MenuItem key={ServiceStatus.IN_PROGRESS} value={ServiceStatus.IN_PROGRESS}>
            <ServiceStatusChip status={ServiceStatus.IN_PROGRESS} />
          </MenuItem>
          <MenuItem key={ServiceStatus.COMPLETED} value={ServiceStatus.COMPLETED}>
            <ServiceStatusChip status={ServiceStatus.COMPLETED} />
          </MenuItem>
          <MenuItem key={ServiceStatus.CANCELLED} value={ServiceStatus.CANCELLED}>
            <ServiceStatusChip status={ServiceStatus.CANCELLED} />
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


