import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { FC } from 'react';
import DueService from '../../shared/DueService.model';
import styles from './DueServicesTable.module.scss';


interface DueServicesTableProps {
  dueServices: Array<DueService>
};

const DueServicesTable: FC<DueServicesTableProps> = ({ dueServices }: DueServicesTableProps) => (

  <div className={styles.DueServicesTable} data-testid="DueServicesTable">
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

          {console.log(dueServices)}

          {
            dueServices.map(service => {

              { console.log(service) }

              <TableRow key={service.id}>

                {console.log('id ' + service.id)}
                <TableCell>{service.id}</TableCell>

                {console.log('name ' + service.client.name)}
                <TableCell align='right'>{service.client.name}</TableCell>

                {console.log('frequency ' + service.contract.serviceFrequency)}
                <TableCell align='right'>{service.contract.serviceFrequency}</TableCell>

                {console.log('dueDate ' + service.dueDate)}
                <TableCell align='right'>Today</TableCell>

                {console.log('status ' + service.currentStatus)}
                <TableCell align='right'>{service.currentStatus}</TableCell>

              </TableRow>;
            })
          }

        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export default DueServicesTable;
