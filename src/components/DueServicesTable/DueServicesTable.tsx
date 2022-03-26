import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { FC } from 'react';
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
          <TableCell align='right'>Status</TableCell>
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
    <TableCell align='right'>{getStatusComponent(service.currentStatus)}</TableCell>
  </TableRow>
)

const NoDueServicesDisplay = () => (
  <Typography variant='h5' data-testid="no-due-services-display">There are no due services at this time</Typography>
);

const getStatusComponent = (currentStatus: ServiceStatus) => {
  switch (currentStatus) {
    case ServiceStatus.NOT_COMPLETED:
      return <NotCompletedServiceStatus />;
    case ServiceStatus.IN_PROGRESS:
      return <InProgressServiceStatus />;
    case ServiceStatus.COMPLETED:
      return <CompletedServiceStatus />
    case ServiceStatus.CANCELLED:
      return <CancelledServiceStatus />
    default:
      new Error(`No status indicator for ${currentStatus} exists`);
  }
};

const NotCompletedServiceStatus = () => (
  <Chip label='Not Completed' color='warning' variant="outlined" size='small'></Chip>
);

const InProgressServiceStatus = () => (
  <Chip label='In Progress' color='info' variant="outlined" size='small'></Chip>
);

const CompletedServiceStatus = () => (
  <Chip label='Completed' color='success' variant="outlined" size='small'></Chip>
);

const CancelledServiceStatus = () => (
  <Chip label='Cancelled' variant="outlined" size='small'></Chip>
);

export default DueServicesTable;


