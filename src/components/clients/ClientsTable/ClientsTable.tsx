import React, {FC} from 'react';
import styles from './ClientsTable.module.scss';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {ClientWithContracts} from "../../../shared/ClientWithContracts.model";
import ClientStatusChip from "../ClientStatusChip/ClientStatusChip";


const STATUS_CHIP_WIDTH = 120;

interface ClientsTableProps {
  clients: ClientWithContracts[]
}

const ClientsTable: FC<ClientsTableProps> = ({clients}: ClientsTableProps) => {

  const hasClients = clients.length !== 0;

  return (
    <div className={styles.ClientsTable} data-testid="clients-table">
      {hasClients ? <VisibleClientsTable clients={clients}/> : <NoClientsDisplay/>}
    </div>
  );
};

interface VisibleClientsTableProps {
  clients: ClientWithContracts[]
}

const VisibleClientsTable = ({clients}: VisibleClientsTableProps) => (
  <TableContainer data-testid="visible-clients-table">
    <Table aria-label="clients table">
      <TableHead>
        <TableRow>
          <TableCell sx={{width: 100}}>Client Id</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell sx={{width: STATUS_CHIP_WIDTH}}>Active</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {clients.map(client => <ClientRow key={client.id} client={client}/>)}
      </TableBody>
    </Table>
  </TableContainer>
);

interface ClientRowProps {
  client: ClientWithContracts
}

const ClientRow = ({client}: ClientRowProps) => (
  <TableRow data-testid="client-table-row">
    <TableCell sx={{width: 100}}>{client.id}</TableCell>
    <TableCell>{client.name}</TableCell>
    <TableCell>{client.email}</TableCell>
    <TableCell sx={{width: STATUS_CHIP_WIDTH}}>
      <ClientStatusChip isActive={client.isActive} chipWidth={STATUS_CHIP_WIDTH}/>
    </TableCell>
  </TableRow>
);

const NoClientsDisplay = () => (
  <Typography variant='h5' data-testid="no-clients-display">There are no clients to display. Consider adding clients to
    the system.</Typography>
);

export default ClientsTable;
