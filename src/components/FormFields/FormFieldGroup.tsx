import { Box, createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import './FormFieldGroup.sass';

interface FormFieldGroupProps {
  fieldClass?: string;
  labelText?: string;
}

export const FormFieldGroup: React.FC<FormFieldGroupProps> = ({ fieldClass, labelText, children }) => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      // root: {
      //   margin: '8px',
      // },
      formFieldGroupLabel: {
        color: 'rgba(0, 0, 0, 0.54)',
        padding: 0,
        fontSize: '.75rem',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontWeight: 400,
        lineHeight: 1,
        letterSpacing: '0.00938em',
        marginBottom: '0.5em',
      },
      gridItemContents: {
        // margin: '8px',
      },
    })
  );
  const classes = useStyles();

  return (
    <Grid item xs={12} md className={clsx(fieldClass)}>
      <Box className={clsx(classes.gridItemContents)}>
        <label className={clsx(`${labelText ? '' : 'hidden'}`, classes.formFieldGroupLabel)}>{labelText === '&nbsp;' ? '\u00A0' : labelText}</label>
        <Box className={'grid-item-contents-children'}>
          {children}
        </Box>
      </Box>
    </Grid>
  );
};

export default FormFieldGroup;