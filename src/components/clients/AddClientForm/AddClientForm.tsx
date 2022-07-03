import React, {FC} from 'react';
import styles from './AddClientForm.module.scss';
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import * as yup from 'yup';
import {useFormik} from "formik";
import Client from "../../../shared/Client.model";

interface AddClientFormProps {
  handleCloseAddClientModal: () => void
  handleAddClient: (prospectiveClient: Client) => void
}

const AddClientForm: FC<AddClientFormProps> = ({handleCloseAddClientModal, handleAddClient}: AddClientFormProps) => {

  const validationSchema = yup.object({
    clientName: yup
      .string()
      .required('Client Name is required'),
    clientEmail: yup
      .string()
      .email('Enter a valid email')
      .required('ClientEmail is required')
  });

  const formik = useFormik({
    initialValues: {
      clientName: '',
      clientEmail: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {

      handleAddClient({
        id: 0, // Using the value 0 b/c the true id will be assigned after creation
        name: values.clientName,
        email: values.clientEmail,
        isActive: false
      });
      handleCloseAddClientModal();
      formik.resetForm()
    }
  });

  return (
    <Box
      className={styles.AddClientForm}
      data-testid="AddClientForm"
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
          color='secondary'
          sx={{marginBottom: 2}}
        >
          Enter Client Information
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="clientName"
            name="clientName"
            label="Client Name"
            variant="standard"
            sx={{marginBottom: 2}}
            value={formik.values.clientName}
            onChange={formik.handleChange}
            error={formik.touched.clientName && Boolean(formik.errors.clientName)}
            helperText={formik.touched.clientName && formik.errors.clientName}
          />
          <TextField
            fullWidth
            id="clientEmail"
            name="clientEmail"
            label="Client Email"
            variant="standard"
            sx={{marginBottom: 2}}
            value={formik.values.clientEmail}
            onChange={formik.handleChange}
            error={formik.touched.clientEmail && Boolean(formik.errors.clientEmail)}
            helperText={formik.touched.clientEmail && formik.errors.clientEmail}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Button
              color="primary"
              variant="outlined"
              type="reset"
              sx={{
                marginRight: 2,
                marginLeft: 2
              }}
              onClick={() => {
                formik.resetForm();
                handleCloseAddClientModal();
              }}
            >
              Cancel
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
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddClientForm;
