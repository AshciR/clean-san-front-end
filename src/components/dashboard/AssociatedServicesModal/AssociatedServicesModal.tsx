import React, {FC} from 'react';
import styles from './AssociatedServicesModal.module.scss';
import DueService from "../../../shared/DueService.model";
import {
  Avatar,
  Box,
  Button,
  Chip,
  ChipProps,
  CircularProgress,
  Paper,
  Theme,
  Typography,
  useTheme
} from "@mui/material";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator
} from "@mui/lab";
import {DateTime} from "luxon";
import {AssociatedServicesModalState} from "./associatedServicesModal.reducer";
import ServiceStatusChip from "../ServiceStatusChip/ServiceStatusChip";
import ServiceStatus from "../../../shared/ServiceStatus.model";

interface AssociatedServicesModalProps {
  modalState: AssociatedServicesModalState
  handleCloseAssociatedServicesModal: () => void
}

const AssociatedServicesModal: FC<AssociatedServicesModalProps> = ({
                                                                     modalState,
                                                                     handleCloseAssociatedServicesModal
                                                                   }: AssociatedServicesModalProps) => {

  const associatedServicesExceptTheLastOne = modalState.associatedServices.slice(0, -1);
  const lastAssociatedService = modalState.associatedServices[modalState.associatedServices.length - 1];

  return (
    <Box
      className={styles.AssociatedServicesModal}
      data-testid="AssociatedServicesModal">
      <Paper
        elevation={2}
        sx={{
          padding: 3,
          width: 800
        }}
      >
        <Typography
          variant='h4'
          color='primary'
          sx={{marginBottom: 1}}
        >
          Related Services
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 2
          }}>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {
            modalState.isLoading ?
              <CircularProgress/> :
              modalState.isFetchError ?
                <Typography variant='h6'>
                  Sorry... we are unable to get the related services at this time.
                </Typography> :
                <Timeline position="left">
                  {
                    associatedServicesExceptTheLastOne.map(service =>
                      <ServicesTimelineItem
                        key={service.id}
                        isSelectedService={service.id === modalState.selectedService?.id}
                        service={service}
                        isLastItem={false}
                      />
                    )
                  }
                  <ServicesTimelineItem
                    key={lastAssociatedService.id}
                    isSelectedService={lastAssociatedService.id === modalState.selectedService?.id}
                    service={lastAssociatedService}
                    isLastItem={true}
                  />
                </Timeline>
          }
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 2
          }}>
          <Button
            color="primary"
            variant="outlined"
            sx={{
              marginRight: 2,
              marginLeft: 2
            }}
            onClick={() => handleCloseAssociatedServicesModal()}
          >
            Close
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

interface ServicesTimelineItemProps {
  service: DueService
  isSelectedService: boolean
  isLastItem: boolean
}

const ServicesTimelineItem: FC<ServicesTimelineItemProps> = ({
                                                               service,
                                                               isSelectedService,
                                                               isLastItem = false
                                                             }: ServicesTimelineItemProps) => {

  const theme = useTheme();
  const latestUpdate = service.history[service.history.length - 1]

  return (
    <TimelineItem>
      <TimelineOppositeContent sx={{paddingTop: '6px'}}>
        <UpdateDateTimeChip
          label={latestUpdate.updateTime.toLocaleString(DateTime.DATETIME_MED)}
          status={latestUpdate.status}
          isFilled={isSelectedService}
        />
      </TimelineOppositeContent>
      <TimelineSeparator>
        <ServiceAvatar
          serviceId={service.id}
          isSelectedService={isSelectedService}
          status={latestUpdate.status}
          theme={theme}
        />
        {
          // We need the connector if it's not the last item in the timeline
          !isLastItem && <TimelineConnector/>
        }
      </TimelineSeparator>
      <TimelineContent sx={{paddingTop: '6px'}}>
        <ServiceStatusChip
          status={latestUpdate.status}
          isFilled={isSelectedService}
        />
      </TimelineContent>
    </TimelineItem>
  );
}

interface UpdateDateTimeChipProps {
  status: ServiceStatus
  label: string
  isFilled?: boolean
}

const UpdateDateTimeChip = ({status, label, isFilled = false}: UpdateDateTimeChipProps) => {

  const chipProps = {
    [ServiceStatus.NOT_COMPLETED]: {color: 'warning'},
    [ServiceStatus.IN_PROGRESS]: {color: 'info'},
    [ServiceStatus.COMPLETED]: {color: 'success'},
    [ServiceStatus.CANCELLED]: {color: 'default'},
  };

  return <Chip
    size='small'
    variant={isFilled ? 'filled' : 'outlined'}
    label={label}
    {...chipProps[status] as ChipProps}
  />

};

interface ServiceAvatarProps {
  serviceId: number
  status: ServiceStatus
  theme: Theme
  isSelectedService: boolean
}

const ServiceAvatar = ({serviceId, status, theme, isSelectedService}: ServiceAvatarProps) =>

  isSelectedService ?
    <Avatar
      sx={{
        width: 36,
        height: 36,
        bgcolor: determineServiceColorBasedOnStatus(status, theme),
      }}
      data-testid="selected-service"
    >
      {serviceId}
    </Avatar> :
    <Avatar
      sx={{
        width: 36,
        height: 36,
        bgcolor: '#FFFFFF',
        color: determineServiceColorBasedOnStatus(status, theme),
        border: 'solid',
        borderColor: determineServiceColorBasedOnStatus(status, theme)
      }}
    >
      {serviceId}
    </Avatar>

const determineServiceColorBasedOnStatus = (status: ServiceStatus, theme: Theme) => {

  switch (status) {
    case ServiceStatus.NOT_COMPLETED:
      return theme.palette.warning.light
    case ServiceStatus.IN_PROGRESS:
      return theme.palette.info.light
    case ServiceStatus.COMPLETED:
      return theme.palette.success.light
    case ServiceStatus.CANCELLED:
      return theme.palette.grey["700"]
  }
}

export default AssociatedServicesModal;
