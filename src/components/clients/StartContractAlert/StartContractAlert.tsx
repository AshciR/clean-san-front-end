import React, {FC} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Contract, {ContractStatus, convertToSentenceCase} from "../../../shared/Contract.model";
import {DateTime} from "luxon";

interface StartContractAlertProps {
  contract: Contract
  isOpen: boolean
  handleStartContract: (contract: Contract) => void
  handleCloseStartContractAlert: () => void
}

const StartContractAlert: FC<StartContractAlertProps> = ({
                                                           contract,
                                                           isOpen,
                                                           handleStartContract,
                                                           handleCloseStartContractAlert
                                                         }: StartContractAlertProps) => (
  <Dialog open={isOpen}>
    <DialogTitle>
      {"Start Contract?"}
    </DialogTitle>
    <DialogContent>
      {`Starting this contract will create ${convertToSentenceCase(contract.serviceFrequency)} services for the client
      from ${contract.startDate.toLocaleString(DateTime.DATE_MED)} 
      until ${contract.endDate.toLocaleString(DateTime.DATE_MED)}.`}
    </DialogContent>
    <DialogActions>
      <Button onClick={() => handleCloseStartContractAlert()}>Cancel</Button>
      <Button onClick={() => {

        const startedContract = {...contract, status: ContractStatus.ACTIVE};
        handleStartContract(startedContract);

        handleCloseStartContractAlert();
      }}
              variant='outlined'
      >
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

export default StartContractAlert;
