import React, {FC} from 'react';
import {Box, Container, Skeleton, Typography} from "@mui/material";
import NavBarWrapper from "../../shared/NavBarWrapper/NavBarWrapper";
import {NAV_BAR_HEIGHT} from "../../shared/NavBar/NavBar";
import {clientsReducer, initialClientsState} from "./clientsPage.reducer";
import ClientsTable from "../ClientsTable/ClientsTable";
import {fetchClientsWithContracts} from "../../../services/clients.services";
import {ClientWithContracts} from "../../../shared/ClientWithContracts.model";

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

  const [clientsState, dispatchClients] = React.useReducer(
    clientsReducer,
    initialClientsState
  );

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
      </Container>
    </Box>
  );
};

export default ClientsPage;