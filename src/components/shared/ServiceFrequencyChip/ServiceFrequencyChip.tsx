import React, {FC} from 'react';
import {ServiceFrequency} from "../../../shared/Contract.model";
import {Chip, ChipProps, createTheme, ThemeProvider} from "@mui/material";

interface ServiceFrequencyChipProps {
  frequency: ServiceFrequency
  width?: number
}

const ServiceFrequencyChip: FC<ServiceFrequencyChipProps> = ({frequency, width = 100}: ServiceFrequencyChipProps) => {

  const chipProps = {
    [ServiceFrequency.WEEKLY]: {color: 'info', label: 'Weekly'},
    [ServiceFrequency.FORTNIGHTLY]: {color: 'secondary', label: 'Fortnightly'},
    [ServiceFrequency.MONTHLY]: {color: 'primary', label: 'Monthly'},
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#729727' // Dark-green
      },
      secondary: {
        main: '#c19c00' // Dark-orange
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Chip
        size='small'
        variant='outlined'
        sx={{width: width}}
        {...chipProps[frequency] as ChipProps} />
    </ThemeProvider>
  );

};

export default ServiceFrequencyChip;
