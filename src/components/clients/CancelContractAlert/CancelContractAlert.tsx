import React, {FC} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Contract, {ContractStatus} from "../../../shared/Contract.model";

interface CancelContractAlertProps {
  contract: Contract
  isOpen: boolean
  handleCancelContract: (contract: Contract) => void
  handleCloseCancelContractAlert: () => void
}

const CancelContractAlert: FC<CancelContractAlertProps> = ({
                                                             contract,
                                                             isOpen,
                                                             handleCancelContract,
                                                             handleCloseCancelContractAlert
                                                           }: CancelContractAlertProps) => (
  <Dialog open={isOpen}>
    <DialogTitle>
      {"Cancel Contract?"}
    </DialogTitle>
    <DialogContent>
      {'Cancelling this contract will cancel all associated not-completed and in-progress services.'}
    </DialogContent>
    <DialogActions>
      <Button onClick={() => handleCloseCancelContractAlert()}>Cancel</Button>
      <Button onClick={() => {

        const cancelledContract = {...contract, status: ContractStatus.CANCELLED};
        handleCancelContract(cancelledContract);

        handleCloseCancelContractAlert();
      }}
              variant='outlined'
      >
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

export default CancelContractAlert;
