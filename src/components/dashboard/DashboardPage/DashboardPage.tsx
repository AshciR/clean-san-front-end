import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterLuxon} from '@mui/x-date-pickers/AdapterLuxon';
import {Box, Container, Fab, Skeleton, TextField, Typography} from '@mui/material';
import {DateTime} from 'luxon';
import React, {FC} from 'react';
import DueService from '../../../shared/DueService.model';
import DueServicesTable from '../DueServicesTable/DueServicesTable';
import SnackbarNotification from '../../shared/SnackbarNotification/SnackbarNotification';
import snackbarNotificationReducer, {
  initialSnackbarNotificationState
} from '../../shared/SnackbarNotification/snackbarNotification.reducer';
import dueServicesReducer, {initialDueServicesState} from './dashboardPage.reducer';
import {fetchDueServices, submitUpdatedServices} from '../../../services/services.services';
import NavBarWrapper from "../../shared/NavBarWrapper/NavBarWrapper";
import {NAV_BAR_HEIGHT} from "../../shared/NavBar/NavBar";

interface DashboardPageProps {

}

const DashboardPage: FC<DashboardPageProps> = () => (
  <NavBarWrapper title={'Dashboard'}>
    <DashboardPageContent distanceFromNavBar={NAV_BAR_HEIGHT}/>
  </NavBarWrapper>
);

interface DashboardPageContentProps {
  distanceFromNavBar?: number
}

const DashboardPageContent: FC<DashboardPageContentProps> = ({distanceFromNavBar = 10}: DashboardPageContentProps) => {

  // State Management
  const [dueServicesState, dispatchDueServices] = React.useReducer(
    dueServicesReducer,
    initialDueServicesState
  );

  const [updateServiceNotificationState, dispatchUpdateServiceNotification] = React.useReducer(
    snackbarNotificationReducer,
    initialSnackbarNotificationState
  );

  const [dueServicesDate, setDueServicesDate] = React.useState<DateTime | null>(DateTime.now());

  // Handlers
  const handleUpdateService = async (updatedService: DueService) => {
    dispatchDueServices({
      type: 'DUE_SERVICES_UPDATE_SERVICE',
      payload: updatedService
    });
  }

  const handleSubmitUpdatedServices = async (services: DueService[]) => {

    try {
      const updatedServices = await submitUpdatedServices(services);
      dispatchDueServices({
        type: 'DUE_SERVICES_UPDATE_SERVICE_SUBMIT_SUCCESS',
        payload: updatedServices
      });

      dispatchUpdateServiceNotification({
        type: 'SNACKBAR_NOTIFICATION_OPEN',
        payload: {
          severity: 'success',
          message: 'Services were updated'
        }
      });

    } catch {
      dispatchDueServices({type: 'DUE_SERVICES_UPDATE_SERVICE_SUBMIT_FAILURE'})

      dispatchUpdateServiceNotification({
        type: 'SNACKBAR_NOTIFICATION_OPEN',
        payload: {
          severity: 'error',
          message: 'There was an error updating the services. Please try again later.'
        }
      });
    }

  };

  const hasAnyServiceBeenUpdated = (dueServices: DueService[]) => {
    const hasChangedStatus = (service: DueService) => service.prospectiveStatus && (service.currentStatus !== service.prospectiveStatus);
    return dueServices.some(hasChangedStatus);

  }
  const handleCloseUpdateServiceNotificationOpen = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatchUpdateServiceNotification({type: 'SNACKBAR_NOTIFICATION_CLOSE'});
  };

  // Effects
  // @ts-ignore
  React.useEffect(() => {

    // We need to check if the component is still using the effect
    let isSubscribed = true;

    const handleFetchDueServices = async () => {

      dispatchDueServices({type: 'DUE_SERVICES_FETCH_INIT'});

      try {
        const dueServices = await fetchDueServices(dueServicesDate || DateTime.now());

        if (isSubscribed) {
          dispatchDueServices({
            type: 'DUE_SERVICES_FETCH_SUCCESS',
            payload: dueServices
          });

        }
      } catch {
        if (isSubscribed) {
          dispatchDueServices({type: 'DUE_SERVICES_FETCH_FAILURE'});
        }
      }

    }

    handleFetchDueServices()

    // Cancel subscription to useEffect
    return () => (isSubscribed = false)

  }, [dueServicesDate]);

  // Rendered components
  return (
    <Box
      data-testid="DashboardPage"
      sx={{
        marginTop: distanceFromNavBar
      }}
    >
      <SnackbarNotification
        open={updateServiceNotificationState.isNotificationOpen}
        handleClose={handleCloseUpdateServiceNotificationOpen}
        severity={updateServiceNotificationState.severity}
        message={updateServiceNotificationState.message}
      />
      <Container maxWidth='xl'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 1
          }}
        >
          <TitleAndDatePicker dueServicesDate={dueServicesDate} setDueServicesDate={setDueServicesDate}/>
        </Box>
        <Box>
          {
            dueServicesState.isLoading ?
              <Skeleton variant="rectangular" animation="wave" data-testid="DueServicesTable-Skeleton"/> :
              dueServicesState.isFetchError ?
                <Typography variant='h4'>
                  Sorry... we weren't able to get the due services at this time.
                </Typography> :
                <DueServicesTable dueServices={dueServicesState.dueServices} handleUpdateService={handleUpdateService}/>
          }
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            margin: 1
          }}
        >
          <Fab
            variant="extended"
            color='primary'
            sx={{
              margin: 1
            }}
            disabled={!hasAnyServiceBeenUpdated(dueServicesState.dueServices)}
            onClick={() => handleSubmitUpdatedServices(dueServicesState.dueServices)}
          >
            Change Statuses
          </Fab>
        </Box>
      </Container>
    </Box>
  )
};

interface TitleAndDatePickerProps {
  dueServicesDate: DateTime | null
  setDueServicesDate: React.Dispatch<React.SetStateAction<DateTime | null>>
}

const TitleAndDatePicker: FC<TitleAndDatePickerProps> = ({
                                                           dueServicesDate,
                                                           setDueServicesDate
                                                         }: TitleAndDatePickerProps) => {
  return (
    <>
      <Typography variant='h3' color='primary'>
        Due Services
      </Typography>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DatePicker
          label='Due services date'
          value={dueServicesDate}
          onChange={(newDueServicesDate) => {
            setDueServicesDate(newDueServicesDate)
          }}
          renderInput={props => {
            return <TextField {...props} helperText={'mm/dd/yyyy'}/>
          }}
        >
        </DatePicker>
      </LocalizationProvider>
    </>
  );
}

export default DashboardPage;


