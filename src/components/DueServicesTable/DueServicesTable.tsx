import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import React, { FC } from 'react';
import DueService from '../../shared/DueService.model';
import styles from './DueServicesTable.module.scss';

interface DueServicesTableProps {
  dueServices: Array<DueService>
};

const DueServicesTable: FC<DueServicesTableProps> = ({ dueServices }: DueServicesTableProps) => {

  const areThereServices = dueServices.length != 0;

  return (
    <div className={styles.DueServicesTable} data-testid="due-services-table">
      <Typography variant='h3'>Due Services</Typography>
      {areThereServices ? <VisableDueServiceTable services={dueServices} /> : <p>Nope</p>}
    </div>
  );
};

interface VisableDueServiceTableProps {
  services: Array<DueService>
};

const VisableDueServiceTable = ({ services }: VisableDueServiceTableProps) => (
  <TableContainer>
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
    <TableCell align='right'>{service.currentStatus}</TableCell>
  </TableRow>
)

export default DueServicesTable;
