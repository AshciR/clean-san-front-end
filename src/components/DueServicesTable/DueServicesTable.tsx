import { Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { FC } from 'react';
import styles from './DueServicesTable.module.scss';



interface DueServicesTableProps { };

const DueServicesTable: FC<DueServicesTableProps> = () => (
  <div className={styles.DueServicesTable} data-testid="DueServicesTable">
    <TableContainer>
      <Table aria-label="due services table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Frequency</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  </div>
);

export default DueServicesTable;
