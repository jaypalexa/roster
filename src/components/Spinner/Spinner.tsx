import { Box } from '@material-ui/core';
import spinnerImage from 'assets/images/spinner-image.png';
import React from 'react';
import './Spinner.sass';

interface SpinnerProps {
  isActive: boolean
}

const Spinner: React.FC<SpinnerProps> = ({isActive}) => {
  return (
    isActive 
      ? <Box className='spinner-container'>
          <img src={spinnerImage} className='rotating' alt='spinner' />
        </Box> 
      : null
  );
};

export default Spinner;
