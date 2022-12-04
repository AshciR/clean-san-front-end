import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import {DateTime} from 'luxon';
import {FC} from 'react';
import DueService from '../../../shared/DueService.model';
import ServiceStatus from '../../../shared/ServiceStatus.model';
import styles from './DueServicesTable.module.scss';
import ServiceStatusChip, {STATUS_CHIP_WIDTH} from "../ServiceStatusChip/ServiceStatusChip";
import ServiceFrequencyChip from "../../shared/ServiceFrequencyChip/ServiceFrequencyChip";
import {ITEMS_PER_PAGE_OPTIONS} from "../DashboardPage/dashboardPage.reducer";

const SERVICE_ID_WIDTH = 100;
const STATUS_COLUMN_WIDTH = STATUS_CHIP_WIDTH + 60;

interface DueServicesTableProps {
  dueServices: Array<DueService>
  totalServices: number
  servicesPerPage: number
  currentPage: number
  handleUpdateService: (updatedService: DueService) => void
  handleOpenViewAssociatedServicesModal: (selectedService: DueService) => void
  handleChangePage: (newPageNumber: number) => void
}

const DueServicesTable: FC<DueServicesTableProps> = ({
                                                       dueServices,
                                                       totalServices,
                                                       servicesPerPage,
                                                       currentPage,
                                                       handleUpdateService,
                                                       handleOpenViewAssociatedServicesModal,
                                                       handleChangePage
                                                     }: DueServicesTableProps) => {

  const hasServices = dueServices.length !== 0;

  return (
    <div className={styles.DueServicesTable} data-testid="due-services-table">
      {hasServices ? <VisibleDueServiceTable
          services={dueServices}
          totalServices={totalServices}
          servicesPerPage={servicesPerPage}
          currentPage={currentPage}
          handleUpdateService={handleUpdateService}
          handleOpenViewAssociatedServicesModal={handleOpenViewAssociatedServicesModal}
          handleChangePage={handleChangePage}
        /> :
        <NoDueServicesDisplay/>}
    </div>
  );
};

interface VisibleDueServiceTableProps {
  services: Array<DueService>
  totalServices: number
  servicesPerPage: number
  currentPage: number
  handleUpdateService: (updatedService: DueService) => void
  handleOpenViewAssociatedServicesModal: (selectedService: DueService) => void
  handleChangePage: (newPageNumber: number) => void
}

const VisibleDueServiceTable = ({
                                  services,
                                  totalServices,
                                  servicesPerPage,
                                  currentPage,
                                  handleUpdateService,
                                  handleOpenViewAssociatedServicesModal,
                                  handleChangePage
                                }: VisibleDueServiceTableProps) => (

  <Box>
    <TableContainer
      data-testid="visible-due-services-table"
      sx={{maxHeight: 550}}
    >
      <Table
        aria-label="due services table"
        stickyHeader={true}
      >
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
            <DueServiceRow
              key={service.id}
              service={service}
              handleUpdateService={handleUpdateService}
              handleOpenViewAssociatedServicesModal={handleOpenViewAssociatedServicesModal}
            />
          )}
        </TableBody>
      </Table>
    </TableContainer>
    {/*TODO: Replace with logic*/}
    <TablePagination
      rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
      component="div"
      count={totalServices}
      rowsPerPage={servicesPerPage}
      page={currentPage}
      onPageChange={(event, newPage) => {
        handleChangePage(newPage);
      }}
      onRowsPerPageChange={() => {
      }}
    />
  </Box>
);

interface DueServiceRowProps {
  service: DueService
  handleUpdateService: (updatedService: DueService) => void
  handleOpenViewAssociatedServicesModal: (selectedService: DueService) => void
}

const DueServiceRow = ({service, handleUpdateService, handleOpenViewAssociatedServicesModal}: DueServiceRowProps) => (
  <TableRow data-testid="due-service-table-row">
    <TableCell sx={{width: SERVICE_ID_WIDTH}}>
      <Button
        size="small"
        color="primary"
        onClick={() => handleOpenViewAssociatedServicesModal(service)}
      >
        {service.id}
      </Button>
    </TableCell>
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
            '& .MuiSelect-select': {paddingTop: 1, paddingBottom: 1} // 8px
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

export default DueServicesTable;


