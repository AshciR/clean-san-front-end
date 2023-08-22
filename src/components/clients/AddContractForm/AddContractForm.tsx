import React, {FC} from 'react';
import styles from './AddContractForm.module.scss';
import {Box, Button, FormControl, MenuItem, Paper, Select, TextField, Typography} from "@mui/material";
import * as yup from 'yup';
import {useFormik} from "formik";
import {AdapterLuxon} from "@mui/x-date-pickers/AdapterLuxon";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DateTime} from "luxon";
import Contract, {ContractStatus, createContract, ServiceFrequency} from "../../../shared/Contract.model";
import ServiceFrequencyChip from "../../shared/ServiceFrequencyChip/ServiceFrequencyChip";
import {ClientWithContracts} from "../../../shared/ClientWithContracts.model";

const TEXT_WIDTH = 200;

interface AddContractFormProps {
  associatedClient: ClientWithContracts | undefined
  handleCloseAddContractModal: () => void
  handleAddContract: (contract: Contract) => void
}

const AddContractForm: FC<AddContractFormProps> = ({
                                                     associatedClient,
                                                     handleCloseAddContractModal,
                                                     handleAddContract
                                                   }: AddContractFormProps) => {


  const defaultStartDate = DateTime.now();
  // Defaulting the end date to be 1 year (exclusive) from now
  const defaultEndDate = defaultStartDate
    .plus({year: 1})
    .minus({day: 1});

  const validationSchema = yup.object({
    startDate: yup.date().required('Start Date is required'),
    endDate: yup.date()
      .min(yup.ref('startDate'), 'End Date must be after start date')
      .required('End Date is required'),
    serviceFrequency: yup.string().required('Service Frequency is required'),
  });

  const formik = useFormik({
    initialValues: {
      startDate: defaultStartDate.toJSDate(),
      endDate: defaultEndDate.toJSDate(),
      serviceFrequency: ServiceFrequency.MONTHLY
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {

      const contractToBeAdded = createContract({
        id: 0, // id will be assigned at time of creation
        // Falling back to 0, shouldn't happen though b/c we can't add a contract
        // without selecting a client prior
        clientId: associatedClient?.client?.id || 0,
        // We don't care about the time for the dates
        startDate: DateTime.fromJSDate(values.startDate).set({hour: 0, minute: 0, second: 0, millisecond: 0}),
        endDate: DateTime.fromJSDate(values.endDate).set({hour: 0, minute: 0, second: 0, millisecond: 0}),
        serviceFrequency: values.serviceFrequency,
        status: ContractStatus.INACTIVE
      });

      handleAddContract(contractToBeAdded);
      handleCloseAddContractModal();
    },
  });

  return (
    <Box
      className={styles.AddContractForm}
      data-testid="AddContractForm"
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
          Enter Contract Information
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <FormDatePicker
            label={'Start date'}
            date={DateTime.fromJSDate(formik.values.startDate)}
            formik={formik}
            dateField={'startDate'}
          />
          <FormDatePicker
            label={'End date'}
            date={DateTime.fromJSDate(formik.values.endDate)}
            formik={formik}
            dateField={'endDate'}
          />
          <ServiceFrequencyPicker
            serviceFrequency={formik.values.serviceFrequency}
            formik={formik}
          />
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
                handleCloseAddContractModal();
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

interface FormDatePickerProps {
  label: string
  date: DateTime | null
  formik: any
  dateField: string
}

const FormDatePicker: FC<FormDatePickerProps> = ({label, date, formik, dateField}: FormDatePickerProps) => {

  const determineIfDateError = (formik: any) => {
    return Object.entries(formik.errors)
      .some(keyValueArray => keyValueArray[0] === dateField);
  }

  const determineHelperText = (formik: any) => {

    // [fieldWithError, errorMsg]
    const errorMap = Object.entries(formik.errors)
      .find(keyValueArray => keyValueArray[0] === dateField);

    // Yup returns an error message like 'must be a `date` type' when
    // the date is invalid
    const invalidDateRegex = /must be a `date` type*/;
    const isEmptyDateErrorMsg = errorMap && !invalidDateRegex.test(errorMap[1] as string);

    return isEmptyDateErrorMsg ? errorMap[1] as string : 'dd/mm/yyyy';

  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'left',
    }}>
      <Typography
        variant='body1'
        sx={{
          width: TEXT_WIDTH,
          paddingTop: 2
        }}
      >
        {`${label}:`}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DatePicker
          value={date}
          onChange={(date) => formik.setFieldValue(dateField, date?.toJSDate())}
          inputFormat="dd/MM/yyyy"
          renderInput={props => {
            return <TextField
              {...props}
              helperText={determineHelperText(formik)}
              error={determineIfDateError(formik)}
            />
          }}
        >
        </DatePicker>
      </LocalizationProvider>
    </Box>
  )

}

interface ServiceFrequencyPickerProps {
  serviceFrequency: ServiceFrequency
  formik: any
}

const ServiceFrequencyPicker: FC<ServiceFrequencyPickerProps> = ({
                                                                   serviceFrequency,
                                                                   formik
                                                                 }: ServiceFrequencyPickerProps) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'left',
    }}>
      <Typography
        variant='body1'
        sx={{
          width: TEXT_WIDTH,
          paddingTop: 2
        }}
      >
        Service Frequency:
      </Typography>
      <ServiceFrequencyDropDown
        frequency={serviceFrequency}
        formik={formik}
      />
    </Box>
  )
}

interface ServiceFrequencyDropDownProps {
  frequency: ServiceFrequency
  formik: any
}

const ServiceFrequencyDropDown = ({frequency, formik}: ServiceFrequencyDropDownProps) => {

  return (
    <Box sx={{marginTop: 2}}>
      <FormControl sx={{width: 231}}>
        <Select
          id={`contract-service-frequency-${frequency.toLowerCase()}`}
          value={frequency}
          onChange={(event) => formik.setFieldValue('serviceFrequency', event.target.value as ServiceFrequency)}
          variant='outlined'
          defaultValue={ServiceFrequency.MONTHLY}
          sx={{
            '& .MuiSelect-select': {paddingTop: 1, paddingBottom: 1} // 8px
          }}
        >
          {
            Object.keys(ServiceFrequency).map(frequency => (
              <MenuItem key={frequency} value={frequency}>
                <ServiceFrequencyChip
                  frequency={frequency as ServiceFrequency}
                  width={200}
                />
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </Box>
  );

}

export default AddContractForm;
