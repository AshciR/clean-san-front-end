import React, {FC} from 'react';
import {Box, Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import ServiceFrequencyChip from "../../shared/ServiceFrequencyChip/ServiceFrequencyChip";
import Contract, {ContractStatus} from "../../../shared/Contract.model";
import ContractStatusChip from "../ContractStatusChip/ContractStatusChip";
import {DateTime} from "luxon";

interface ContractCardProps {
  contract: Contract;
}

const ContractCard: FC<ContractCardProps> = ({contract}: ContractCardProps) => {

  const textWidth = 100;
  const cardContentMargin = 1; // translates to 8px

  return (
    <Card
      variant='outlined'
      sx={{
        width: 325,
        height: 225,
        margin: 3,
        borderColor: contract.status === ContractStatus.ACTIVE ? 'secondary.main' : ''
      }}
    >
      <CardContent>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'left',
          margin: cardContentMargin
        }}>
          <Typography variant='body1' sx={{width: textWidth}}>
            Start date:&nbsp;
          </Typography>
          <Typography variant='body1' sx={{width: textWidth}}>
            {contract.startDate.toLocaleString(DateTime.DATE_MED)}
          </Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'left',
          margin: cardContentMargin
        }}>
          <Typography
            variant='body1'
            sx={{
              width: textWidth
            }}
          >
            End date:&nbsp;
          </Typography>
          <Typography variant='body1' sx={{width: textWidth}}>
            {contract.endDate.toLocaleString(DateTime.DATE_MED)}
          </Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'left',
          margin: cardContentMargin
        }}>
          <Typography variant='body1' sx={{width: textWidth}}>
            Frequency:&nbsp;
          </Typography>
          <ServiceFrequencyChip frequency={contract.serviceFrequency}/>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'left',
          margin: cardContentMargin
        }}>
          <Typography variant='body1' sx={{width: textWidth}}>
            Status:&nbsp;
          </Typography>
          <ContractStatusChip status={contract.status} chipWidth={100}/>
        </Box>
      </CardContent>
      <CardActions
        disableSpacing={true}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end'
        }}>
        <Button size="small" variant='outlined' disabled={isStartButtonDisabled(contract.status)}>Start</Button>
        <Button size="small" disabled={isCancelButtonDisabled(contract.status)}>Cancel</Button>
      </CardActions>
    </Card>
  );
};

const isStartButtonDisabled = (status: ContractStatus) => {
  return status !== ContractStatus.INACTIVE;
};

const isCancelButtonDisabled = (status: ContractStatus) => {
  return status !== ContractStatus.ACTIVE;
};

export default ContractCard;
