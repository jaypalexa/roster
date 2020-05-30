import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormFieldMuiProps from './FormFieldMuiProps';

export const FormFieldMui: React.FC<FormFieldMuiProps> = ({ fieldName, fieldClass, labelText, disabled, children }) => {

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      margin: {
        margin: theme.spacing(1),
      },
      withoutLabel: {
        marginTop: theme.spacing(3),
      },
      textField: {
        // width: '25ch',
      },
    }),
  );
  const classes = useStyles();

  const { errors, formState } = useFormContext();
  return (
    <Grid item xs={12} md>
      <FormControl 
        className={clsx(classes.margin, classes.textField, fieldClass)} 
        disabled={disabled}
        error={errors[fieldName] && formState.dirty} 
        fullWidth={true}
      >
        {children}
        <FormHelperText id={`${fieldName}-helper-text`}>{errors[fieldName]?.message}</FormHelperText>
      </FormControl>
    </Grid>
  );
};

export default FormFieldMui;