import { createStyles, makeStyles, RadioGroup, Theme } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import React from 'react';
import { Controller, useFormContext } from "react-hook-form";
import FormField, { FormFieldProps } from './FormField';

export const RadioButtonGroupFormField: React.FC<FormFieldProps> = ({ fieldName, labelText, children }) => {

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
    <FormField fieldName={fieldName} labelText={labelText}>
      <FormLabel component='legend' className={classes.formLabel}>{labelText}</FormLabel>
      <Controller 
        name={fieldName} 
        control={control}
        as={
          <RadioGroup aria-label={`${fieldName}-label`} name={fieldName}>
            {children}
          </RadioGroup>
        }
      />
    </FormField>
  );
};

export default RadioButtonGroupFormField;