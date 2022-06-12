import React, {FC} from 'react';
import {Box, Typography} from "@mui/material";
import NavBarWrapper from "../../shared/NavBarWrapper/NavBarWrapper";
import {NAV_BAR_HEIGHT} from "../../shared/NavBar/NavBar";

interface ClientsPageProps {

}

const ClientsPage: FC<ClientsPageProps> = () => (
  <NavBarWrapper>
    <ClientsPageContent distanceFromNavBar={NAV_BAR_HEIGHT}/>
  </NavBarWrapper>

);

interface ClientsPageContentProps {
  distanceFromNavBar?: number
}

const ClientsPageContent: FC<ClientsPageContentProps> = ({distanceFromNavBar}) => (
  <Box
    data-testid="ClientsPage"
    sx={{
      marginTop: distanceFromNavBar
    }}
  >
    <Typography variant='h1'>
      Clients Page
    </Typography>
  </Box>
);

export default ClientsPage;