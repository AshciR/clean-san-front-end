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
  TableSortLabel,
  Typography
} from "@mui/material";
import {ClientWithContracts} from "../../../shared/ClientWithContracts.model";
import ClientStatusChip from "../ClientStatusChip/ClientStatusChip";
import {ITEMS_PER_PAGE_OPTIONS} from "../../dashboard/DashboardPage/dashboardPage.reducer";
import {ClientsPageOrderByOptions, OrderByOptions, SortOrder} from "../ClientsPage/clientsPage.reducer";


const STATUS_CHIP_WIDTH = 120;

interface ClientsTableProps {
  clients: ClientWithContracts[]
  totalClients: number
  clientsPerPage: number
  currentPage: number
  sortOrder: SortOrder
  handleOpenViewAssociatedContractsModal: (client: ClientWithContracts) => void
  handleChangePage: (newPageNumber: number) => void
  handleChangeRowsPerPage: (newRowsPerPage: number) => void
  handleSortBy: (orderBy: ClientsPageOrderByOptions) => void
}

const ClientsTable: FC<ClientsTableProps> = ({
                                               clients,
                                               totalClients,
                                               clientsPerPage,
                                               currentPage,
                                               sortOrder,
                                               handleOpenViewAssociatedContractsModal,
                                               handleChangePage,
                                               handleChangeRowsPerPage,
                                               handleSortBy
                                             }: ClientsTableProps) => {

  const hasClients = clients.length !== 0;

  return (
    <div className={styles.ClientsTable} data-testid="clients-table">
      {hasClients ? <VisibleClientsTable
          clientsWIthContracts={clients}
          totalClients={totalClients}
          clientsPerPage={clientsPerPage}
          currentPage={currentPage}
          sortOrder={sortOrder}
          handleOpenViewAssociatedContractsModal={handleOpenViewAssociatedContractsModal}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleSortBy={handleSortBy}
        /> :
        <NoClientsDisplay/>}
    </div>
  );
};

interface VisibleClientsTableProps {
  clientsWIthContracts: ClientWithContracts[]
  totalClients: number
  clientsPerPage: number
  currentPage: number
  sortOrder: SortOrder
  handleOpenViewAssociatedContractsModal: (client: ClientWithContracts) => void
  handleChangePage: (newPageNumber: number) => void
  handleChangeRowsPerPage: (newRowsPerPage: number) => void
  handleSortBy: (orderBy: ClientsPageOrderByOptions) => void
}

const VisibleClientsTable = ({
                               clientsWIthContracts,
                               totalClients,
                               clientsPerPage,
                               currentPage,
                               sortOrder,
                               handleOpenViewAssociatedContractsModal,
                               handleChangePage,
                               handleChangeRowsPerPage,
                               handleSortBy
                             }: VisibleClientsTableProps) => (

  <Box>
    <TableContainer data-testid="visible-clients-table">
      <Table aria-label="clients table">
        <TableHead>
          <TableRow>
            <TableCell sx={{width: 100}}>Client Id</TableCell>
            <TableCell>
              Name
              <TableSortLabel
                active={sortOrder.orderBy === ClientsPageOrderByOptions.NAME}
                direction={sortOrder.orderBy === ClientsPageOrderByOptions.NAME ? sortOrder.direction : OrderByOptions.ASC}
                onClick={() => handleSortBy(ClientsPageOrderByOptions.NAME)}
              />
            </TableCell>
            <TableCell>Primary Contact</TableCell>
            <TableCell>Telephone</TableCell>
            <TableCell>Email</TableCell>
            <TableCell sx={{width: STATUS_CHIP_WIDTH}}>Active</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientsWIthContracts.map(clientWithContract =>
            <ClientRow
              key={clientWithContract.client.id}
              clientWithContracts={clientWithContract}
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
  clientWithContracts: ClientWithContracts
  handleOpenViewAssociatedContractsModal: (client: ClientWithContracts) => void
}

const ClientRow = ({clientWithContracts, handleOpenViewAssociatedContractsModal}: ClientRowProps) => (
  <TableRow data-testid="client-table-row">
    <TableCell sx={{width: 100}}>
      <Button
        size="small"
        color="primary"
        onClick={() => handleOpenViewAssociatedContractsModal(clientWithContracts)}
      >
        {clientWithContracts.client.id}
      </Button>
    </TableCell>
    <TableCell>{clientWithContracts.client.name}</TableCell>
    <TableCell>{`${clientWithContracts.client.primaryContactFirstName} ${clientWithContracts.client.primaryContactLastName}`}</TableCell>
    <TableCell>{clientWithContracts.client.telephoneNumber}</TableCell>
    <TableCell>{clientWithContracts.client.email}</TableCell>
    <TableCell sx={{width: STATUS_CHIP_WIDTH}}>
      <ClientStatusChip isActive={clientWithContracts.isActive} chipWidth={STATUS_CHIP_WIDTH}/>
    </TableCell>
  </TableRow>
);

const NoClientsDisplay = () => (
  <Typography variant='h5' data-testid="no-clients-display">
    There are no clients to display. Add clients with the "Add Clients" Button.
  </Typography>
);

export default ClientsTable;
