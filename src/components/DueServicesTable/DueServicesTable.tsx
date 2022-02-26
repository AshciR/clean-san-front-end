import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import React, { FC } from 'react';
import DueService from '../../shared/DueService.model';
import styles from './DueServicesTable.module.scss';


const generateDueServicesRow = (dueServices: Array<DueService>) => {

  return dueServices.map(service => {

    return (
      <TableRow key={service.id}>
        <TableCell>{service.id}</TableCell>
        <TableCell align='right'>{service.client.name}</TableCell>
        <TableCell align='right'>{service.contract.serviceFrequency}</TableCell>
        <TableCell align='right'>{service.dueDate.toLocaleString(DateTime.DATE_MED)}</TableCell>
        <TableCell align='right'>{service.currentStatus}</TableCell>
      </TableRow>
    );

  });
};

interface DueServicesTableProps {
  dueServices: Array<DueService>
};

const DueServicesTable: FC<DueServicesTableProps> = ({ dueServices }: DueServicesTableProps) => (

  <div className={styles.DueServicesTable} data-testid="DueServicesTable">
    <Typography variant='h3'>Due Services</Typography>
    
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
          {generateDueServicesRow(dueServices)}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export default DueServicesTable;
