import React, {FC} from 'react';
import styles from './ClientsTable.module.scss';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";
import {ClientWithContracts} from "../../../shared/ClientWithContracts.model";
import ClientStatusChip from "../ClientStatusChip/ClientStatusChip";
import {ITEMS_PER_PAGE_OPTIONS} from "../../dashboard/DashboardPage/dashboardPage.reducer";


const STATUS_CHIP_WIDTH = 120;

interface ClientsTableProps {
  clients: ClientWithContracts[]
  totalClients: number
  clientsPerPage: number
  currentPage: number
  handleOpenViewAssociatedContractsModal: (client: ClientWithContracts) => void
  handleChangePage: (newPageNumber: number) => void
  handleChangeRowsPerPage: (newRowsPerPage: number) => void
}

const ClientsTable: FC<ClientsTableProps> = ({
                                               clients,
                                               totalClients,
                                               clientsPerPage,
                                               currentPage,
                                               handleOpenViewAssociatedContractsModal,
                                               handleChangePage,
                                               handleChangeRowsPerPage
                                             }: ClientsTableProps) => {

  const hasClients = clients.length !== 0;

  return (
    <div className={styles.ClientsTable} data-testid="clients-table">
      {hasClients ? <VisibleClientsTable
          clients={clients}
          totalClients={totalClients}
          clientsPerPage={clientsPerPage}
          currentPage={currentPage}
          handleOpenViewAssociatedContractsModal={handleOpenViewAssociatedContractsModal}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        /> :
        <NoClientsDisplay/>}
    </div>
  );
};

interface VisibleClientsTableProps {
  clients: ClientWithContracts[]
  totalClients: number
  clientsPerPage: number
  currentPage: number
  handleOpenViewAssociatedContractsModal: (client: ClientWithContracts) => void
  handleChangePage: (newPageNumber: number) => void
  handleChangeRowsPerPage: (newRowsPerPage: number) => void
}

const VisibleClientsTable = ({
                               clients,
                               totalClients,
                               clientsPerPage,
                               currentPage,
                               handleOpenViewAssociatedContractsModal,
                               handleChangePage,
                               handleChangeRowsPerPage
                             }: VisibleClientsTableProps) => (

  <Box>
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
          {clients.map(client =>
            <ClientRow
              key={client.id}
              client={client}
              handleOpenViewAssociatedContractsModal={handleOpenViewAssociatedContractsModal}/>)
          }
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
      component="div"
      count={totalClients}
      rowsPerPage={clientsPerPage}
      page={currentPage}
      onPageChange={(event, newPage) => {
        handleChangePage(newPage);
      }}
      onRowsPerPageChange={(event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        handleChangeRowsPerPage(newRowsPerPage)
      }}
    />
  </Box>

);

interface ClientRowProps {
  client: ClientWithContracts
  handleOpenViewAssociatedContractsModal: (client: ClientWithContracts) => void
}

const ClientRow = ({client, handleOpenViewAssociatedContractsModal}: ClientRowProps) => (
  <TableRow data-testid="client-table-row">
    <TableCell sx={{width: 100}}>
      <Button
        size="small"
        color="primary"
        onClick={() => handleOpenViewAssociatedContractsModal(client)}
      >
        {client.id}
      </Button>
    </TableCell>
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
