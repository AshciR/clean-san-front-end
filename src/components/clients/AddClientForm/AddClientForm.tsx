import React, {FC, useState} from 'react';
import styles from './AddClientForm.module.scss';
import {Box, Button, Paper, Step, StepLabel, Stepper, TextField, Typography} from "@mui/material";
import * as yup from 'yup';
import {getIn, useFormik} from "formik";
import Client from "../../../shared/Client.model";

interface AddClientFormProps {
  handleCloseAddClientModal: () => void
  handleAddClient: (prospectiveClient: Client) => void
}

const AddClientForm: FC<AddClientFormProps> = ({handleCloseAddClientModal, handleAddClient}: AddClientFormProps) => {

  const phoneRegExp = /^\d{10}$/;

  const validationSchema = yup.object({
    client: yup.object({
        clientName: yup.string().required('Client Name is required'),
        clientPrimaryContactFirstName: yup.string().required('Primary Contact First Name is required'),
        clientPrimaryContactLastName: yup.string().required('Primary Contact Last Name is required'),
        telephoneNumber: yup.string().matches(phoneRegExp, 'Phone number must be a 10-digit number'),
        clientEmail: yup.string().email('Enter a valid email')
      }),
    primaryLocation: yup.object({

    })
  });

  const formik = useFormik({
    initialValues: {
      client: {
        clientName: '',
        clientPrimaryContactFirstName: '',
        clientPrimaryContactLastName: '',
        telephoneNumber: '',
        clientEmail: ''
      },
      primaryLocation: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        parish: '',
        postalCode: ''
      }
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {

      handleAddClient({
        id: 0, // Using the value 0 b/c the true id will be assigned after creation
        name: values.client.clientName,
        primaryContactFirstName: values.client.clientPrimaryContactFirstName,
        primaryContactLastName: values.client.clientPrimaryContactLastName,
        telephoneNumber: values.client.telephoneNumber === '' ? undefined : values.client.telephoneNumber,
        email: values.client.clientEmail === '' ? undefined : values.client.clientEmail,
        isActive: false
      });
      handleCloseAddClientModal();
      formik.resetForm()
    }
  });

  // Form navigation handlers
  const steps = ["Contact Information", "Primary Location", "Confirm & Submit"];
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step: number, formik: any) => {
    switch (step) {
      case 0:
        return <ContactInformationStep formik={formik}/>;
      case 1:
        return <PrimaryLocationStep formik={formik}/>
      case 2:
        return <Typography>Review and Submit.</Typography>;
      default:
        return <Typography>Whoops, and error occurred.</Typography>;
    }
  };

  const isOnFirstStep = activeStep === 0;
  const isOnLastStep = activeStep === steps.length - 1;

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
          Add Client Information
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={formik.handleSubmit} noValidate>
          {renderStepContent(activeStep, formik)}
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
              variant="outlined"
              disabled={isOnFirstStep}
              sx={{
                marginRight: 2,
                marginLeft: 2
              }}
              onClick={() => {
                handleBack();
              }}
            >
              Back
            </Button>
            <Button
              color="primary"
              variant="contained"
              type={isOnLastStep ? "submit" : undefined}
              sx={{
                marginRight: 2,
                marginLeft: 2
              }}
              onClick={() => {
                handleNext();
              }}
            >
              {isOnLastStep ? "Submit" : "Next"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

interface ContactInformationStepProps {
  formik: any
}

const ContactInformationStep: FC<ContactInformationStepProps> = ({formik}: ContactInformationStepProps) => {
  console.log(formik)
  // formik.touched.client?.clientName && formik.errors.client?.clientName
  // error={formik.touched.client?.clientName && Boolean(formik.errors.client?.clientName)}
  return (
    <Box>
      <TextField
        fullWidth
        id="clientName"
        name="client.clientName"
        label="Company Name"
        variant="standard"
        required={true}
        sx={{marginBottom: 2}}
        value={formik.values.client.clientName}
        onChange={formik.handleChange}
        error={formik.touched.client?.clientName && Boolean(formik.errors.client?.clientName)}
        helperText={formik.touched.client?.clientName && Boolean(formik.errors.client?.clientName)}
      />
      <Box sx={{display: 'flex', gap: 2}}>
        <TextField
          id="clientPrimaryContactFirstName"
          name="client.clientPrimaryContactFirstName"
          label="Primary Contact First Name"
          variant="standard"
          required={true}
          sx={{marginBottom: 2, flex: 1}}
          value={formik.values.client.clientPrimaryContactFirstName}
          onChange={formik.handleChange}
          error={formik.touched.client?.clientPrimaryContactFirstName && Boolean(formik.errors.client?.clientPrimaryContactFirstName)}
          helperText={formik.touched.client?.clientPrimaryContactFirstName && formik.errors.client?.clientPrimaryContactFirstName}
        />
        <TextField
          id="clientPrimaryContactLastName"
          name="client.clientPrimaryContactLastName"
          label="Primary Contact Last Name"
          variant="standard"
          required={true}
          sx={{marginBottom: 2, flex: 1}}
          value={formik.values.client.clientPrimaryContactLastName}
          onChange={formik.handleChange}
          error={formik.touched.client?.clientPrimaryContactLastName && Boolean(formik.errors.client?.clientPrimaryContactLastName)}
          helperText={formik.touched.client?.clientPrimaryContactLastName && formik.errors.client?.clientPrimaryContactLastName}
        />
      </Box>
      <Box sx={{display: 'flex', gap: 2}}>
        <TextField
          id="telephoneNumber"
          name="client.telephoneNumber"
          label="Telephone Number"
          variant="standard"
          sx={{marginBottom: 2, flex: 1}}
          value={formik.values.client.telephoneNumber}
          onChange={formik.handleChange}
          error={formik.touched.client?.telephoneNumber && Boolean(formik.errors.client?.telephoneNumber)}
          helperText={formik.touched.client?.telephoneNumber && formik.errors.client?.telephoneNumber}
        />
        <TextField
          id="clientEmail"
          name="client.clientEmail"
          label="Email"
          variant="standard"
          sx={{marginBottom: 2, flex: 1}}
          value={formik.values.client.clientEmail}
          onChange={formik.handleChange}
          error={formik.touched.client?.clientEmail && Boolean(formik.errors.client?.clientEmail)}
          helperText={formik.touched.client?.clientEmail && formik.errors.client?.clientEmail}
        />
      </Box>
    </Box>
  );
}

interface PrimaryLocationStepProps {
  formik: any
}

const PrimaryLocationStep: FC<PrimaryLocationStepProps> = ({formik}: PrimaryLocationStepProps) => {
  return (
    <Box>
      <Box sx={{display: 'flex', gap: 2}}>
        <TextField
          fullWidth
          id="addressLine1"
          name="addressLine1"
          label="Address Line 1"
          variant="standard"
          required={true}
          sx={{marginBottom: 2, flex: 1}}
          value={formik.values.primaryLocation.addressLine1}
          onChange={formik.handleChange}
          error={formik.touched.primaryLocation.addressLine1 && Boolean(formik.errors.primaryLocation.addressLine1)}
          helperText={formik.touched.primaryLocation.addressLine1 && formik.errors.primaryLocation.addressLine1}
        />
        <TextField
          id="addressLine2"
          name="addressLine2"
          label="Address Line 2"
          variant="standard"
          required={true}
          sx={{marginBottom: 2, flex: 1}}
          value={formik.values.primaryLocation.addressLine2}
          onChange={formik.handleChange}
          error={formik.touched.primaryLocation.addressLine2 && Boolean(formik.errors.primaryLocation.addressLine2)}
          helperText={formik.touched.primaryLocation.addressLine2 && formik.errors.primaryLocation.addressLine2}
        />
        <TextField
          id="city"
          name="city"
          label="City"
          variant="standard"
          required={true}
          sx={{marginBottom: 2, flex: 1}}
          value={formik.values.primaryLocation.city}
          onChange={formik.handleChange}
          error={formik.touched.primaryLocation.city && Boolean(formik.errors.primaryLocation.city)}
          helperText={formik.touched.primaryLocation.city && formik.errors.primaryLocation.city}
        />
      </Box>
      <Box sx={{display: 'flex', gap: 2}}>
        <TextField
          id="parish"
          name="parish"
          label="Parish"
          variant="standard"
          required={true}
          sx={{marginBottom: 2, flex: 1}}
          value={formik.values.primaryLocation.parish}
          onChange={formik.handleChange}
          error={formik.touched.primaryLocation.parish && Boolean(formik.errors.primaryLocation.parish)}
          helperText={formik.touched.primaryLocation.parish && formik.errors.primaryLocation.parish}
        />
        <TextField
          id="postalCode"
          name="postalCode"
          label="Postal Code"
          variant="standard"
          sx={{marginBottom: 2, flex: 1}}
          value={formik.values.postalCode}
          onChange={formik.handleChange}
          error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
          helperText={formik.touched.postalCode && formik.errors.postalCode}
        />
      </Box>
    </Box>
  );
}

export default AddClientForm;
