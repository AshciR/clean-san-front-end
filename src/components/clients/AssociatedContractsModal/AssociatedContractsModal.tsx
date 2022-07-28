import React, {FC} from 'react';
import styles from './AssociatedContractsModal.module.scss';
import {Box, Button, Paper, Typography} from "@mui/material";
import ContractCard from "../ContractCard/ContractCard";
import {AssociatedContractsModalState} from "./associatedContractsModal.reducer";

interface AssociatedContractsModalProps {
  modalState: AssociatedContractsModalState
  handleCloseAssociatedContractsModal: () => void
}

const AssociatedContractsModal: FC<AssociatedContractsModalProps> = ({
                                                                       modalState,
                                                                       handleCloseAssociatedContractsModal
                                                                     }: AssociatedContractsModalProps) => {

  return (
    <Box
      className={styles.AssociatedContractsModal}
      data-testid="AssociatedContractsModal"
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
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
          {`Contracts for ${modalState.clientWithContracts?.name}`}
        </Typography>
        <Box
          sx={{
            padding: 3,
            display: 'flex',
            alignContent: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          {
            modalState.clientWithContracts?.contracts.map(contract =>
              <ContractCard key={contract.id} contract={contract}/>)
          }
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'right',
          }}>
          <Button
            color="primary"
            variant="outlined"
            sx={{
              marginRight: 2,
              marginLeft: 2
            }}
            onClick={() => handleCloseAssociatedContractsModal()}
          >
            Close
          </Button>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            sx={{
              marginRight: 2,
              marginLeft: 2
            }}
          >
            Add Contract
          </Button>
        </Box>
      </Paper>
    </Box>

  );
};

export default AssociatedContractsModal;
