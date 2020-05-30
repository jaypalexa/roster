import { Grid } from '@material-ui/core';
import React from 'react';

export const FormFieldRowMui: React.FC = (props) => {
  return (
    <Grid container justify='center' spacing={3}>
      {props.children}
    </Grid>
  );
};

export default FormFieldRowMui;