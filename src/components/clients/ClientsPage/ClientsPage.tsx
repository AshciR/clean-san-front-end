import React, {FC} from 'react';
import {Backdrop, Box, Container, Fab, Skeleton, Typography} from "@mui/material";
import NavBarWrapper from "../../shared/NavBarWrapper/NavBarWrapper";
import {NAV_BAR_HEIGHT} from "../../shared/NavBar/NavBar";
import {
  ClientsPageOrderByOptions,
  clientsReducer,
  convertSortOrderToQueryParam,
  initialClientsState
} from "./clientsPage.reducer";
import ClientsTable from "../ClientsTable/ClientsTable";
import {
  addClient,
  addContractToClient,
  fetchClientsWithContracts,
  updateContract
} from "../../../services/clients.services";
import {ClientWithContracts} from "../../../shared/ClientWithContracts.model";
import AddClientForm from "../AddClientForm/AddClientForm";
import Client from "../../../shared/Client.model";
import snackbarNotificationReducer, {
  initialSnackbarNotificationState
} from "../../shared/SnackbarNotification/snackbarNotification.reducer";
import SnackbarNotification from "../../shared/SnackbarNotification/SnackbarNotification";
import {
  associatedContractsReducer,
  initialAssociatedContractsModalState
} from "../AssociatedContractsModal/associatedContractsModal.reducer";
import AssociatedContractsModal from "../AssociatedContractsModal/AssociatedContractsModal";
import AddContractForm from "../AddContractForm/AddContractForm";
import Contract, {convertToSentenceCase} from "../../../shared/Contract.model";
import StartContractAlert from "../StartContractAlert/StartContractAlert";
import CancelContractAlert from "../CancelContractAlert/CancelContractAlert";

interface ClientsPageProps {

}

const ClientsPage: FC<ClientsPageProps> = () => (
  <NavBarWrapper title={'Clients'}>
    <ClientsPageContent distanceFromNavBar={NAV_BAR_HEIGHT}/>
  </NavBarWrapper>

);

interface ClientsPageContentProps {
  distanceFromNavBar?: number
}

const ClientsPageContent: FC<ClientsPageContentProps> = ({distanceFromNavBar}) => {

  // State Management
  const [clientsState, dispatchClients] = React.useReducer(
    clientsReducer,
    initialClientsState
  );

  const [clientsPageNotificationState, dispatchClientsPageNotification] = React.useReducer(
    snackbarNotificationReducer,
    initialSnackbarNotificationState
  );

  const [associatedContractsModalState, dispatchAssociatedContractsModal] = React.useReducer(
    associatedContractsReducer,
    initialAssociatedContractsModalState
  )

  const [addClientModalOpen, setAddClientModalOpen] = React.useState(false);
  const [addContractModalOpen, setAddContractModalOpen] = React.useState(false);
  const [startContractAlertOpen, setStartContractAlertOpen] = React.useState(false);
  const [cancelContractAlertOpen, setCancelContractAlertOpen] = React.useState(false);

  // Handlers
  const handleCloseAddClientModal = () => {
    setAddClientModalOpen(false);
  }

  const handleOpenAddClientModal = () => {
    setAddClientModalOpen(true);
  };

  const handleCloseAddContractModal = () => {
    setAddContractModalOpen(false);
  }

  const handleOpenAddContractModal = () => {
    setAddContractModalOpen(true);
  };

  const handleAddClient = async (prospectiveClient: Client) => {

    try {
      const addedClient = await addClient(prospectiveClient);
      dispatchClients({
        type: 'CLIENTS_ADD_CLIENT_SUCCESS',
        payload: addedClient
      });

      dispatchClientsPageNotification({
        type: 'SNACKBAR_NOTIFICATION_OPEN',
        payload: {
          severity: 'success',
          message: `${addedClient.name} was added`
        }
      });

    } catch {
      dispatchClients({
        type: 'CLIENTS_ADD_CLIENT_FAILURE'
      });

      dispatchClientsPageNotification({
        type: 'SNACKBAR_NOTIFICATION_OPEN',
        payload: {
          severity: 'error',
          message: 'There was an error adding the new client. Please try again later.'
        }
      });
    }
  }

  const handleCloseUpdateServiceNotificationOpen = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatchClientsPageNotification({type: 'SNACKBAR_NOTIFICATION_CLOSE'});
  };

  const handleOpenViewAssociatedContractsModal = (clientWithContracts: ClientWithContracts) => {

    dispatchAssociatedContractsModal({
      type: 'ASSOCIATED_CONTRACTS_SELECT_CLIENT',
      payload: clientWithContracts
    });

  };

  const handleCloseViewAssociatedContractsModal = () => {

    dispatchAssociatedContractsModal({
      type: 'ASSOCIATED_CONTRACTS_CLOSE_MODAL'
    });

  };

  const handleOpenStartContractAlert = (contract: Contract) => {

    dispatchAssociatedContractsModal({
      type: 'ASSOCIATED_CONTRACTS_OPEN_START_CONTRACT_ALERT',
      payload: contract
    });

    setStartContractAlertOpen(true);
  };

  const handleCloseStartContractAlert = () => {
    setStartContractAlertOpen(false);
  }

  const handleOpenCancelContractAlert = (contract: Contract) => {

    dispatchAssociatedContractsModal({
      type: 'ASSOCIATED_CONTRACTS_OPEN_CANCEL_CONTRACT_ALERT',
      payload: contract
    });

    setCancelContractAlertOpen(true);
  };

  const handleCloseCancelContractAlert = () => {
    setCancelContractAlertOpen(false);
  }

  const handleAddContract = async (prospectiveContract: Contract) => {

    try {
      const addedContract = await addContractToClient(prospectiveContract);

      dispatchClients({
        type: 'CLIENTS_ADD_CONTRACT_SUCCESS',
        payload: addedContract
      });

      const contractFrequency = addedContract.serviceFrequency.charAt(0) + prospectiveContract.serviceFrequency.substring(1).toLowerCase();

      dispatchClientsPageNotification({
        type: 'SNACKBAR_NOTIFICATION_OPEN',
        payload: {
          severity: 'success',
          message: `${contractFrequency} contract was added`
        }
      });

    } catch {

      dispatchClients({
        type: 'CLIENTS_ADD_CONTRACT_FAILURE',
      });

      dispatchClientsPageNotification({
        type: 'SNACKBAR_NOTIFICATION_OPEN',
        payload: {
          severity: 'error',
          message: 'There was an error adding the new contract. Please try again later.'
        }
      });

    }

  };

  const handleStartContract = async (contractToBeStarted: Contract) => {

    try {

      const startedContract = await updateContract(contractToBeStarted);

      dispatchClients({
        type: 'CLIENTS_START_CONTRACT_SUCCESS',
        payload: startedContract
      });

      dispatchClientsPageNotification({
        type: 'SNACKBAR_NOTIFICATION_OPEN',
        payload: {
          severity: 'success',
          message: `${(convertToSentenceCase(startedContract.serviceFrequency))} contract was started`
        }
      });

    } catch {

      dispatchClientsPageNotification({
        type: 'SNACKBAR_NOTIFICATION_OPEN',
        payload: {
          severity: 'error',
          message: 'There was an error starting the contract. Please try again later.'
        }
      });

    }

  }

  const handleCancelContract = async (contractToBeCancelled: Contract) => {

    try {

      const cancelledContract = await updateContract(contractToBeCancelled);

      dispatchClients({
        type: 'CLIENTS_CANCEL_CONTRACT_SUCCESS',
        payload: cancelledContract
      });

      dispatchClientsPageNotification({
        type: 'SNACKBAR_NOTIFICATION_OPEN',
        payload: {
          severity: 'success',
          message: `${(convertToSentenceCase(cancelledContract.serviceFrequency))} contract was cancelled`
        }
      });

    } catch {

      dispatchClientsPageNotification({
        type: 'SNACKBAR_NOTIFICATION_OPEN',
        payload: {
          severity: 'error',
          message: 'There was an error cancelling the contract. Please try again later.'
        }
      });

    }

  }

  const handleChangeRowsPerPage = (itemsPerPage: number) => {

    dispatchClients({
      type: 'CLIENTS_CHANGE_ITEMS_PER_PAGE',
      payload: itemsPerPage
    });

    // Have to set the page number back to 0 when we
    // switch the number of rows per page
    dispatchClients({
      type: 'CLIENTS_CHANGE_PAGE_NUMBER',
      payload: 0
    });

  };

  const handleChangePage = (newPageNumber: number) => {

    dispatchClients({
      type: 'CLIENTS_CHANGE_PAGE_NUMBER',
      payload: newPageNumber
    });

  };

  const handleSortBy = (orderBy: ClientsPageOrderByOptions) => {
    dispatchClients({
      type: 'CLIENTS_SET_SORT_ORDER',
      payload: orderBy
    });
  }

  // @ts-ignore
  React.useEffect(() => {

    // We need to check if the component is still using the effect
    let isSubscribed = true;

    const handleFetchClientsWithContracts = async () => {

      dispatchClients({type: 'CLIENTS_FETCH_INIT'});

      try {
        const paginatedClients = await fetchClientsWithContracts(
          clientsState.pageNumber,
          clientsState.itemsPerPage,
          convertSortOrderToQueryParam(clientsState.sortOrder)
        );

        if (isSubscribed) {
          dispatchClients({
            type: 'CLIENTS_FETCH_SUCCESS',
            payload: paginatedClients.clients
          });

          dispatchClients({
            type: 'CLIENTS_SET_TOTAL_ITEMS',
            payload: paginatedClients.totalItems
          })

        }
      } catch {
        if (isSubscribed) {
          dispatchClients({type: 'CLIENTS_FETCH_FAILURE'})
        }
      }
    }

    handleFetchClientsWithContracts()

    // Cancel subscription to useEffect
    return () => (isSubscribed = false)
  }, [clientsState.itemsPerPage, clientsState.pageNumber, clientsState.sortOrder]);

  return (
    <Box
      data-testid="ClientsPage"
      sx={{
        marginTop: distanceFromNavBar
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          handleCloseAddClientModal()
        }
      }}
    >
      <SnackbarNotification
        open={clientsPageNotificationState.isNotificationOpen}
        handleClose={handleCloseUpdateServiceNotificationOpen}
        severity={clientsPageNotificationState.severity}
        message={clientsPageNotificationState.message}
      />
      {
        // Only render if the user wants to see the associated contracts
        associatedContractsModalState.isOpen &&
          <Backdrop
              sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
              open={associatedContractsModalState.isOpen}
              data-testid="ViewAssociatedContractsModal"
          >
              <AssociatedContractsModal
                  modalState={associatedContractsModalState}
                  handleCloseAssociatedContractsModal={handleCloseViewAssociatedContractsModal}
                  handleOpenAddContractModal={handleOpenAddContractModal}
                  handleOpenStartContractAlert={handleOpenStartContractAlert}
                  handleOpenCancelContractAlert={handleOpenCancelContractAlert}/>
          </Backdrop>
      }
      {
        associatedContractsModalState.selectedContract &&
          <>
              <StartContractAlert
                  isOpen={startContractAlertOpen}
                  contract={associatedContractsModalState.selectedContract}
                  handleStartContract={handleStartContract}
                  handleCloseStartContractAlert={handleCloseStartContractAlert}
              />
              <CancelContractAlert
                  isOpen={cancelContractAlertOpen}
                  contract={associatedContractsModalState.selectedContract}
                  handleCancelContract={handleCancelContract}
                  handleCloseCancelContractAlert={handleCloseCancelContractAlert}
              />
          </>
      }
      {
        // Only render if the user needs to add a new contract
        addContractModalOpen &&
          <Backdrop
              sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
              open={addContractModalOpen}
              data-testid="AddContractModal"
          >
              <AddContractForm
                  associatedClient={associatedContractsModalState.clientWithContracts}
                  handleCloseAddContractModal={handleCloseAddContractModal}
                  handleAddContract={handleAddContract}
              />
          </Backdrop>
      }
      <Container maxWidth='xl'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 1
          }}
        >
          <Typography variant='h3' color='primary'>Clients</Typography>
        </Box>
        <Box>
          {
            clientsState.isLoading ?
              <Skeleton variant="rectangular" animation="wave" data-testid="ClientsTable-Skeleton"/> :
              clientsState.isFetchError ?
                <Typography variant='h4'>
                  Sorry... we weren't able to get the clients at this time.
                </Typography> :
                <>
                  <ClientsTable
                    clients={clientsState.clients}
                    totalClients={clientsState.totalItems}
                    clientsPerPage={clientsState.itemsPerPage}
                    currentPage={clientsState.pageNumber}
                    sortOrder={clientsState.sortOrder}
                    handleOpenViewAssociatedContractsModal={handleOpenViewAssociatedContractsModal}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    handleSortBy={handleSortBy}
                  />
                </>
          }
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            margin: 1
          }}>
          <Fab
            variant="extended"
            color='primary'
            sx={{
              margin: 1
            }}
            onClick={handleOpenAddClientModal}
          >
            Add Client
          </Fab>
        </Box>
        <Backdrop
          sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
          open={addClientModalOpen}
          data-testid="AddClientModal"
        >
          <AddClientForm
            handleCloseAddClientModal={handleCloseAddClientModal}
            handleAddClient={handleAddClient}
          />
        </Backdrop>
      </Container>
    </Box>
  );
};

export default ClientsPage;