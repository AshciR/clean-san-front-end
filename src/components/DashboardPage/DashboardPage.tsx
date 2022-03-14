import { Skeleton, Typography } from '@mui/material';
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
      // TODO: Will add new state to the reducer in the upcoming story
      throw new Error('There was an error fetching the Due Services');
    }

  }, []);

  React.useEffect(() => {
    handleFetchDueServices();
  }, [handleFetchDueServices]);

  return (
    <div className={styles.DashboardPage} data-testid="DashboardPage">
      <Typography variant='h3'>Due Services</Typography>
      {
        dueServicesState.isLoading ?
          <Skeleton variant="rectangular" animation="wave" data-testid="DueServicesTable-Skeleton" /> :
          <DueServicesTable dueServices={dueServicesState.dueServices} />
      }
    </div>
  )
};

export default DashboardPage;
