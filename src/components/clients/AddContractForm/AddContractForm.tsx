import React, {FC} from 'react';
import styles from './AddContractForm.module.scss';

interface AddContractFormProps {
  handleCloseAddContractModal: () => void
  handleAddContract: () => void // TODO: Add correct parameter
}

const AddContractForm: FC<AddContractFormProps> = ({
                                                     handleCloseAddContractModal,
                                                     handleAddContract
                                                   }: AddContractFormProps) => (
  <div className={styles.AddContractForm} data-testid="AddContractForm">
    AddContractForm Component
  </div>
);

export default AddContractForm;
