import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import { Box, Container, Fab, Skeleton, TextField, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import React, { FC } from 'react';
import DueService from '../../shared/DueService.model';
import DueServicesTable from '../DueServicesTable/DueServicesTable';
import dueServicesReducer, { initialDueServicesState } from './dashboardPage.reducer';
import { fetchDueServices, submitUpdatedServices } from './dashboardPage.services';

interface DashboardPageProps { }

const DashboardPage: FC<DashboardPageProps> = () => {

  const [dueServicesState, dispatchDueServices] = React.useReducer(
    dueServicesReducer,
    initialDueServicesState
  );

  const [dueServicesDate, setDueServicesDate] = React.useState<DateTime | null>(DateTime.now());

  const handleFetchDueServices = React.useCallback(async (dueServicesDate: DateTime | null) => {

    dispatchDueServices({ type: 'DUE_SERVICES_FETCH_INIT' });

    try {
      const dueServices = await fetchDueServices(dueServicesDate || DateTime.now());

      dispatchDueServices({
        type: 'DUE_SERVICES_FETCH_SUCCESS',
        payload: dueServices
      });

    } catch {
      dispatchDueServices({ type: 'DUE_SERVICES_FETCH_FAILURE' });
    }

  }, []);

  const handleUpdateService = (updatedService: DueService) => {
    dispatchDueServices({
      type: 'DUE_SERVICES_UPDATE_SERVICE',
      payload: updatedService
    });
  }

  const handleSubmitUpdatedServices = async (servicesToBeSubmitted: DueService[]) => {

    try {
      await submitUpdatedServices(servicesToBeSubmitted);
      // TODO: Show sucess snackbar
      await handleFetchDueServices(dueServicesDate);
    } catch {
      // TODO: Show failure snackbar
    }

  };

  const hasAnyServiceBeenUpdated = (dueServices: DueService[]) => {
    return dueServices.some(service => service.prospectiveStatus && (service.currentStatus !== service.prospectiveStatus));
  }

  React.useEffect(() => {
    handleFetchDueServices(dueServicesDate);
  }, [handleFetchDueServices, dueServicesDate]);

  return (
    <Box
      sx={{ margin: 2 }}
      data-testid="DashboardPage"
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
          <TitleAndDatePicker dueServicesDate={dueServicesDate} setDueServicesDate={setDueServicesDate} />
        </Box>
        <Box>
          {
            dueServicesState.isLoading ?
              <Skeleton variant="rectangular" animation="wave" data-testid="DueServicesTable-Skeleton" /> :
              dueServicesState.isError ?
                <Typography variant='h4'>Sorry... we weren't able to get the due services at this time.</Typography> :
                <DueServicesTable dueServices={dueServicesState.dueServices} handleUpdateService={handleUpdateService} />
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

const TitleAndDatePicker: FC<TitleAndDatePickerProps> = ({ dueServicesDate, setDueServicesDate }: TitleAndDatePickerProps) => {
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
            return <TextField {...props} helperText={'mm/dd/yyyy'} />
          }}
        >
        </DatePicker>
      </LocalizationProvider>
    </>
  );
}

export default DashboardPage;


