import { createStyles, makeStyles, RadioGroup, Theme } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import React from 'react';
import { Controller, useFormContext } from "react-hook-form";
import FormField, { FormFieldProps } from './FormField';

interface RadioButtonGroupFormFieldProps extends FormFieldProps {
  labelText?: string;
}

export const RadioButtonGroupFormField: React.FC<RadioButtonGroupFormFieldProps> = ({ children, fieldName, labelText }) => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      formLabel: {
        fontSize: '.75rem',
      },
    })
  );
  const classes = useStyles();

  const { control } = useFormContext();

  return (
    <FormField fieldName={fieldName}>
      <FormLabel className={classes.formLabel} component='legend'>{labelText}</FormLabel>
      <Controller 
        as={
          <RadioGroup aria-label={`${fieldName}-label`} name={fieldName}>
            {children}
          </RadioGroup>
        }
        control={control}
        name={fieldName} 
      />
    </FormField>
  );
};

export default RadioButtonGroupFormField;