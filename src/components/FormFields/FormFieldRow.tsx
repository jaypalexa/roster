import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import sharedStyles from 'styles/sharedStyles';

export const FormFieldRow: React.FC = (props) => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(
      {
        ...sharedStyles(theme),
        root: {
          width: '100%',
        },
      })
  );
  const classes = useStyles();

  return (
    <Grid container justifyContent='center' spacing={3} className={classes.root}>
      {props.children}
    </Grid>
  );
};

export default FormFieldRow;