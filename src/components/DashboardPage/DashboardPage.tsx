import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import { Box, Container, Grid, Skeleton, TextField, Typography } from '@mui/material';
import React, { FC } from 'react';
import DueServicesTable from '../DueServicesTable/DueServicesTable';
import styles from './DashboardPage.module.scss';
import dueServicesReducer, { initialDueServicesState } from './dashboardPage.reducer';
import { fetchDueServices } from './dashboardPage.services';

interface DashboardPageProps { }

const DashboardPage: FC<DashboardPageProps> = () => {

  const [dueServicesState, dispatchDueServices] = React.useReducer(
    dueServicesReducer,
    initialDueServicesState
  );

  const handleFetchDueServices = React.useCallback(async () => {

    dispatchDueServices({ type: 'DUE_SERVICES_FETCH_INIT' });

    try {
      const dueServices = await fetchDueServices();

      dispatchDueServices({
        type: 'DUE_SERVICES_FETCH_SUCCESS',
        payload: dueServices
      });

    } catch {
      dispatchDueServices({ type: 'DUE_SERVICES_FETCH_FAILURE' });
    }

  }, []);

  React.useEffect(() => {
    handleFetchDueServices();
  }, [handleFetchDueServices]);

  return (
    <div className={styles.DashboardPage} data-testid="DashboardPage">

      <Container maxWidth='xl'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant='h3'>Due Services</Typography>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DatePicker
              label='Due services date'
              value={() => { }}
              onChange={() => { }}
              renderInput={props => <TextField {...props} />}
            >
            </DatePicker>
          </LocalizationProvider>
        </Box>

        <Box>
          {
            dueServicesState.isLoading ?
              <Skeleton variant="rectangular" animation="wave" data-testid="DueServicesTable-Skeleton" /> :
              dueServicesState.isError ?
                <Typography variant='h4'>Sorry... we weren't able to get the due services at this time.</Typography> :
                <DueServicesTable dueServices={dueServicesState.dueServices} />
          }
        </Box>
      </Container>

    </div>
  )
};

export default DashboardPage;
