import React, {FC} from 'react';
import {Backdrop, Box, Container, Fab, Skeleton, Typography} from "@mui/material";
import NavBarWrapper from "../../shared/NavBarWrapper/NavBarWrapper";
import {NAV_BAR_HEIGHT} from "../../shared/NavBar/NavBar";
import {clientsReducer, initialClientsState} from "./clientsPage.reducer";
import ClientsTable from "../ClientsTable/ClientsTable";
import {fetchClientsWithContracts} from "../../../services/clients.services";
import {ClientWithContracts} from "../../../shared/ClientWithContracts.model";
import AddClientForm from "../AddClientForm/AddClientForm";

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

  const [addClientModalOpen, setAddClientModalOpen] = React.useState(false);

  // Handlers
  const handleCloseAddClientModal = () => {
    setAddClientModalOpen(false);
  }

  const handleOpenAddClientModal = () => {
    setAddClientModalOpen(true);
  };

  // @ts-ignore
  React.useEffect(() => {

    // We need to check if the component is still using the effect
    let isSubscribed = true;

    const handleFetchClientsWithContracts = async () => {

      dispatchClients({type: 'CLIENTS_FETCH_INIT'});

      try {
        const clients: ClientWithContracts[] = await fetchClientsWithContracts();

        if (isSubscribed) {
          dispatchClients({
            type: 'CLIENTS_FETCH_SUCCESS',
            payload: clients
          });

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
  }, []);

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
      <Container maxWidth='xl'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 1
          }}
        >
          <Typography variant='h3' color='primary'>Clients Page</Typography>
        </Box>
        <Box>
          {
            clientsState.isLoading ?
              <Skeleton variant="rectangular" animation="wave" data-testid="ClientsTable-Skeleton"/> :
              clientsState.isFetchError ?
                <Typography variant='h4'>
                  Sorry... we weren't able to get the clients at this time.
                </Typography> :
                <ClientsTable clients={clientsState.clients}/>
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
          <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={addClientModalOpen}
            data-testid="AddClientModal"
          >
            <AddClientForm handleCloseAddClientModal={handleCloseAddClientModal}/>
          </Backdrop>
        </Box>
      </Container>
    </Box>
  );
};

export default ClientsPage;