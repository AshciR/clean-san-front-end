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

  const phoneRegExp = /^\d{10}$/;

  const validationSchema = yup.object({
    clientName: yup.string().required('Client Name is required'),
    clientPrimaryContactFirstName: yup.string().required('Primary Contact First Name is required'),
    clientPrimaryContactLastName: yup.string().required('Primary Contact Last Name is required'),
    telephoneNumber: yup.string().matches(phoneRegExp, 'Phone number must be a 10-digit number'),
    clientEmail: yup.string().email('Enter a valid email')
  });

  const formik = useFormik({
    initialValues: {
      clientName: '',
      clientPrimaryContactFirstName: '',
      clientPrimaryContactLastName: '',
      telephoneNumber: '',
      clientEmail: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {

      handleAddClient({
        id: 0, // Using the value 0 b/c the true id will be assigned after creation
        name: values.clientName,
        primaryContactFirstName: values.clientPrimaryContactFirstName,
        primaryContactLastName: values.clientPrimaryContactLastName,
        telephoneNumber: values.telephoneNumber === '' ? undefined : values.telephoneNumber,
        email: values.clientEmail === '' ? undefined : values.clientEmail,
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
            label="Company Name"
            variant="standard"
            required={true}
            sx={{marginBottom: 2}}
            value={formik.values.clientName}
            onChange={formik.handleChange}
            error={formik.touched.clientName && Boolean(formik.errors.clientName)}
            helperText={formik.touched.clientName && formik.errors.clientName}
          />
          <Box sx={{display: 'flex', gap: 2 }}>
            <TextField
              id="clientPrimaryContactFirstName"
              name="clientPrimaryContactFirstName"
              label="Primary Contact First Name"
              variant="standard"
              required={true}
              sx={{marginBottom: 2, flex: 1}}
              value={formik.values.clientPrimaryContactFirstName}
              onChange={formik.handleChange}
              error={formik.touched.clientPrimaryContactFirstName && Boolean(formik.errors.clientPrimaryContactFirstName)}
              helperText={formik.touched.clientPrimaryContactFirstName && formik.errors.clientPrimaryContactFirstName}
            />
            <TextField
              id="clientPrimaryContactLastName"
              name="clientPrimaryContactLastName"
              label="Primary Contact Last Name"
              variant="standard"
              required={true}
              sx={{marginBottom: 2, flex: 1}}
              value={formik.values.clientPrimaryContactLastName}
              onChange={formik.handleChange}
              error={formik.touched.clientPrimaryContactLastName && Boolean(formik.errors.clientPrimaryContactLastName)}
              helperText={formik.touched.clientPrimaryContactLastName && formik.errors.clientPrimaryContactLastName}
            />
          </Box>
          <Box sx={{display: 'flex', gap: 2 }}>
            <TextField
              id="telephoneNumber"
              name="telephoneNumber"
              label="Telephone Number"
              variant="standard"
              sx={{marginBottom: 2, flex: 1}}
              value={formik.values.telephoneNumber}
              onChange={formik.handleChange}
              error={formik.touched.telephoneNumber && Boolean(formik.errors.telephoneNumber)}
              helperText={formik.touched.telephoneNumber && formik.errors.telephoneNumber}
            />
            <TextField
              id="clientEmail"
              name="clientEmail"
              label="Email"
              variant="standard"
              sx={{marginBottom: 2, flex: 1}}
              value={formik.values.clientEmail}
              onChange={formik.handleChange}
              error={formik.touched.clientEmail && Boolean(formik.errors.clientEmail)}
              helperText={formik.touched.clientEmail && formik.errors.clientEmail}
            />
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
