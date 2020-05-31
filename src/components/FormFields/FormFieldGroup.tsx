import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
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
      root: {
        margin: '8px',
      },
      formFieldGroupLabel: {
        color: 'rgba(0, 0, 0, 0.54)',
        padding: 0,
        fontSize: '.75rem',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontWeight: 400,
        lineHeight: 1,
        letterSpacing: '0.00938em',
      },
    })
  );
  const classes = useStyles();

  return (
    <Grid item xs={12} md className={clsx(classes.root, fieldClass)}>
      <label className={clsx(`label ${labelText ? '' : 'hidden'}`, classes.formFieldGroupLabel)}>{labelText === '&nbsp;' ? '\u00A0' : labelText}</label>
      <div className='control is-expanded'>
        {children}
      </div>
    </Grid>
  );
};

export default FormFieldGroup;