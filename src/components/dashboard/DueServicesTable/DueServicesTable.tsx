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
  TableSortLabel,
  Typography
} from '@mui/material';
import {DateTime} from 'luxon';
import {FC} from 'react';
import DueService from '../../../shared/DueService.model';
import ServiceStatus from '../../../shared/ServiceStatus.model';
import styles from './DueServicesTable.module.scss';
import ServiceStatusChip, {STATUS_CHIP_WIDTH} from "../ServiceStatusChip/ServiceStatusChip";
import ServiceFrequencyChip from "../../shared/ServiceFrequencyChip/ServiceFrequencyChip";
import {DashboardOrderByOptions, ITEMS_PER_PAGE_OPTIONS, SortOrder} from "../DashboardPage/dashboardPage.reducer";

const SERVICE_ID_WIDTH = 100;
const STATUS_COLUMN_WIDTH = STATUS_CHIP_WIDTH + 60;

interface DueServicesTableProps {
  dueServices: Array<DueService>
  totalServices: number
  servicesPerPage: number
  currentPage: number
  sortOrder: SortOrder
  handleUpdateService: (updatedService: DueService) => void
  handleOpenViewAssociatedServicesModal: (selectedService: DueService) => void
  handleChangePage: (newPageNumber: number) => void
  handleChangeRowsPerPage: (newRowsPerPage: number) => void
  handleSortBy: (sortColumn: string) => void
}

const DueServicesTable: FC<DueServicesTableProps> = ({
                                                       dueServices,
                                                       totalServices,
                                                       servicesPerPage,
                                                       currentPage,
                                                       sortOrder,
                                                       handleUpdateService,
                                                       handleOpenViewAssociatedServicesModal,
                                                       handleChangePage,
                                                       handleChangeRowsPerPage,
                                                       handleSortBy
                                                     }: DueServicesTableProps) => {

  const hasServices = dueServices.length !== 0;

  return (
    <div className={styles.DueServicesTable} data-testid="due-services-table">
      {hasServices ? <VisibleDueServiceTable
          services={dueServices}
          totalServices={totalServices}
          servicesPerPage={servicesPerPage}
          currentPage={currentPage}
          sortOrder={sortOrder}
          handleUpdateService={handleUpdateService}
          handleOpenViewAssociatedServicesModal={handleOpenViewAssociatedServicesModal}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleSortBy={handleSortBy}
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
  sortOrder: SortOrder
  handleUpdateService: (updatedService: DueService) => void
  handleOpenViewAssociatedServicesModal: (selectedService: DueService) => void
  handleChangePage: (newPageNumber: number) => void
  handleChangeRowsPerPage: (newRowsPerPage: number) => void
  handleSortBy: (sortColumn: string) => void
}

const VisibleDueServiceTable = ({
                                  services,
                                  totalServices,
                                  servicesPerPage,
                                  currentPage,
                                  sortOrder,
                                  handleUpdateService,
                                  handleOpenViewAssociatedServicesModal,
                                  handleChangePage,
                                  handleChangeRowsPerPage,
                                  handleSortBy
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
            <TableCell>
              <TableSortLabel
                active={sortOrder.orderBy === DashboardOrderByOptions.CLIENT}
                direction={sortOrder.direction}
                onClick={() => handleSortBy(DashboardOrderByOptions.CLIENT)}
              />
              Client
            </TableCell>
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
    <TablePagination
      rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
      component="div"
      count={totalServices}
      rowsPerPage={servicesPerPage}
      page={currentPage}
      onPageChange={(event, newPage) => {
        handleChangePage(newPage);
      }}
      onRowsPerPageChange={(event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        handleChangeRowsPerPage(newRowsPerPage)
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


