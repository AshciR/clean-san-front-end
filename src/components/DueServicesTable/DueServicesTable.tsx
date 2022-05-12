import {
  Box, Chip, ChipProps, FormControl, MenuItem, Select, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from '@mui/material';
import { DateTime } from 'luxon';
import { FC } from 'react';
import DueService from '../../shared/DueService.model';
import ServiceStatus from '../../shared/ServiceStatus.model';
import styles from './DueServicesTable.module.scss';

interface DueServicesTableProps {
  dueServices: Array<DueService>
  handleUpdateService: (updatedService: DueService) => void
}

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
}

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
}

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
      <StatusDropDown service={service} handleUpdateService={handleUpdateService} />
    </TableCell>
  </TableRow>
)

const NoDueServicesDisplay = () => (
  <Typography variant='h5' data-testid="no-due-services-display">There are no due services at this time</Typography>
);


interface StatusDropDownProps {
  service: DueService
  handleUpdateService: (updatedService: DueService) => void
}

const StatusDropDown = ({ service, handleUpdateService }: StatusDropDownProps) => {
  return (
    <Box>
      <FormControl fullWidth>
        <Select
          id={`new-status-select-${service.id}`}
          value={service?.prospectiveStatus || service.currentStatus}
          onChange={(event) => {
            const updatedService = {
              ...service,
              prospectiveStatus: event.target.value as ServiceStatus
            };
            handleUpdateService(updatedService)
          }}
          variant='outlined'
          defaultValue={service.currentStatus}
        >
          {
            Object.keys(ServiceStatus).map((status) => (
              <MenuItem key={status} value={status} >
                <ServiceStatusChip status={status as ServiceStatus} />
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </Box>
  );
};

interface ServiceStatusChipProps {
  status: ServiceStatus
}

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


