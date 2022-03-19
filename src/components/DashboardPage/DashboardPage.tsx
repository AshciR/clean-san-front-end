import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import { Box, Container, Skeleton, TextField, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import React, { FC } from 'react';
import DueServicesTable from '../DueServicesTable/DueServicesTable';
import dueServicesReducer, { initialDueServicesState } from './dashboardPage.reducer';
import { fetchDueServices } from './dashboardPage.services';

interface DashboardPageProps { }

const DashboardPage: FC<DashboardPageProps> = () => {

  const [dueServicesState, dispatchDueServices] = React.useReducer(
    dueServicesReducer,
    initialDueServicesState
  );

  const [dueServicesDate, setDueServicesDate] = React.useState<DateTime | null>(DateTime.now());

  const handleFetchDueServices = React.useCallback(async (dueServicesDate) => {

    dispatchDueServices({ type: 'DUE_SERVICES_FETCH_INIT' });

    try {
      const dueServices = await fetchDueServices(dueServicesDate);

      dispatchDueServices({
        type: 'DUE_SERVICES_FETCH_SUCCESS',
        payload: dueServices
      });

    } catch {
      dispatchDueServices({ type: 'DUE_SERVICES_FETCH_FAILURE' });
    }

  }, []);

  React.useEffect(() => {
    handleFetchDueServices(dueServicesDate);
  }, [handleFetchDueServices, dueServicesDate]);

  return (
    <Box
      sx={{ margin: 2 }}
      data-testid="DashboardPage"
    >
      <Container maxWidth='xl'>
        <TitleAndDatePicker dueServicesDate={dueServicesDate} setDueServicesDate={setDueServicesDate} />
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
    </Box>
  )
};

interface TitleAndDatePickerProps {
  dueServicesDate: DateTime | null
  setDueServicesDate: React.Dispatch<React.SetStateAction<DateTime | null>>
}

const TitleAndDatePicker: FC<TitleAndDatePickerProps> = ({ dueServicesDate, setDueServicesDate }: TitleAndDatePickerProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 1
      }}
    >
      <Typography variant='h3'>Due Services</Typography>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DatePicker
          label='Due services date'
          value={dueServicesDate}
          onChange={(newDueServicesDate) => {
            setDueServicesDate(newDueServicesDate)
          }}
          renderInput={props => <TextField {...props} />}
        >
        </DatePicker>
      </LocalizationProvider>
    </Box>
  );
}

export default DashboardPage;
