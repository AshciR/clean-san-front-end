import {
  Box,
  Chip,
  ChipProps,
  createTheme,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography
} from '@mui/material';
import {DateTime} from 'luxon';
import {FC} from 'react';
import DueService from '../../../shared/DueService.model';
import ServiceStatus from '../../../shared/ServiceStatus.model';
import styles from './DueServicesTable.module.scss';
import {ServiceFrequency} from "../../../shared/Contract.model";

const SERVICE_ID_WIDTH = 100;
const STATUS_CHIP_WIDTH = 120;
const STATUS_COLUMN_WIDTH = STATUS_CHIP_WIDTH + 60;

interface DueServicesTableProps {
  dueServices: Array<DueService>
  handleUpdateService: (updatedService: DueService) => void
}

const DueServicesTable: FC<DueServicesTableProps> = ({dueServices, handleUpdateService}: DueServicesTableProps) => {

  const hasServices = dueServices.length !== 0;

  return (
    <div className={styles.DueServicesTable} data-testid="due-services-table">
      {hasServices ? <VisibleDueServiceTable services={dueServices} handleUpdateService={handleUpdateService}/> :
        <NoDueServicesDisplay/>}
    </div>
  );
};

interface VisibleDueServiceTableProps {
  services: Array<DueService>
  handleUpdateService: (updatedService: DueService) => void
}

const VisibleDueServiceTable = ({services, handleUpdateService}: VisibleDueServiceTableProps) => (
  <TableContainer data-testid="visible-due-services-table">
    <Table aria-label="due services table">
      <TableHead>
        <TableRow>
          <TableCell sx={{width: SERVICE_ID_WIDTH}}>Service Id</TableCell>
          <TableCell>Client</TableCell>
          <TableCell>Frequency</TableCell>
          <TableCell>Due Date</TableCell>
          <TableCell sx={{width: STATUS_COLUMN_WIDTH}}>Current Status</TableCell>
          <TableCell sx={{width: STATUS_COLUMN_WIDTH}}>New Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {services.map(service =>
          <DueServiceRow key={service.id} service={service} handleUpdateService={handleUpdateService}/>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

interface DueServiceRowProps {
  service: DueService
  handleUpdateService: (updatedService: DueService) => void
}

const DueServiceRow = ({service, handleUpdateService}: DueServiceRowProps) => (
  <TableRow data-testid="due-service-table-row">
    <TableCell sx={{width: SERVICE_ID_WIDTH}}>{service.id}</TableCell>
    <TableCell>{service.client.name}</TableCell>
    <TableCell>
      <ServiceFrequencyChip frequency={service.contract.serviceFrequency}/>
    </TableCell>
    <TableCell>{service.dueDate.toLocaleString(DateTime.DATE_MED)}</TableCell>
    <TableCell sx={{width: STATUS_COLUMN_WIDTH}}>
      <ServiceStatusChip status={service.currentStatus}/>
    </TableCell>
    <TableCell sx={{width: STATUS_COLUMN_WIDTH}}>
      <StatusDropDown service={service} handleUpdateService={handleUpdateService}/>
    </TableCell>
  </TableRow>
)

const NoDueServicesDisplay = () => (
  <Typography variant='h5' data-testid="no-due-services-display">There are no due services at this time</Typography>
);


interface StatusDropDownProps {
  service: DueService
  handleUpdateService: (updatedService: DueService) => void
}

const StatusDropDown = ({service, handleUpdateService}: StatusDropDownProps) => {
  return (
    <Box>
      <FormControl sx={{width: STATUS_COLUMN_WIDTH}}>
        <Select
          id={`new-status-select-${service.id}`}
          value={service?.prospectiveStatus || service.currentStatus}
          onChange={(event) => {
            const updatedService = {
              ...service,
              prospectiveStatus: event.target.value as ServiceStatus
            };
            handleUpdateService(updatedService)

          }}
          variant='outlined'
          defaultValue={service.currentStatus}
          sx={{
            '& .MuiSelect-select':{ paddingTop: 1, paddingBottom: 1} // 8px
          }}
        >
          {
            Object.keys(ServiceStatus).map((status) => (
              <MenuItem key={status} value={status}>
                <ServiceStatusChip status={status as ServiceStatus}/>
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </Box>
  );
};

interface ServiceStatusChipProps {
  status: ServiceStatus
}

const ServiceStatusChip = ({status}: ServiceStatusChipProps) => {

  const chipProps = {
    [ServiceStatus.NOT_COMPLETED]: {color: 'warning', label: 'Not Completed'},
    [ServiceStatus.IN_PROGRESS]: {color: 'info', label: 'In Progress'},
    [ServiceStatus.COMPLETED]: {color: 'success', label: 'Completed'},
    [ServiceStatus.CANCELLED]: {color: 'default', label: 'Cancelled'},
  };

  return <Chip
    size='small'
    variant='outlined'
    sx={{width: STATUS_CHIP_WIDTH}}
    {...chipProps[status] as ChipProps} />

};

interface ServiceFrequencyChipProps {
  frequency: ServiceFrequency
}

const ServiceFrequencyChip = ({frequency}: ServiceFrequencyChipProps) => {

  const chipProps = {
    [ServiceFrequency.WEEKLY]: {color: 'info', label: 'Weekly'},
    [ServiceFrequency.FORTNIGHTLY]: {color: 'secondary', label: 'Fortnightly'},
    [ServiceFrequency.MONTHLY]: {color: 'primary', label: 'Monthly'},
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#729727' // Dark-green
      },
      secondary: {
        main: '#c19c00' // Dark-orange
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Chip
        size='small'
        variant='outlined'
        sx={{width: 100}}
        {...chipProps[frequency] as ChipProps} />
    </ThemeProvider>
  );

};

export default DueServicesTable;


