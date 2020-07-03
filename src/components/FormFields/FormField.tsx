import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ValidationRules } from 'react-hook-form/dist/types';

export interface FormFieldProps {
  disabled?: boolean;
  fieldClass?: string;
  fieldName: string;
  validationRules?: ValidationRules;
};

export const FormField: React.FC<FormFieldProps> = ({ children, disabled, fieldClass, fieldName }) => {

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
    }),
  );
  const classes = useStyles();

  const { errors, formState } = useFormContext();
  return (
    <Grid item xs={12} md>
      <FormControl 
        className={clsx(classes.margin, fieldClass)} 
        disabled={disabled}
        error={errors[fieldName] && formState.isDirty} 
        fullWidth={true}
      >
        {children}
        <FormHelperText id={`${fieldName}-helper-text`}>{errors[fieldName]?.message}</FormHelperText>
      </FormControl>
    </Grid>
  );
};

export default FormField;