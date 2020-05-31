import { createStyles, makeStyles, RadioGroup, Theme } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import React from 'react';
import { Controller, useFormContext } from "react-hook-form";
import FormFieldMui, { FormFieldMuiProps } from './FormFieldMui';

export const RadioButtonGroupFormFieldMui: React.FC<FormFieldMuiProps> = ({ fieldName, labelText, children }) => {

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
    <FormFieldMui fieldName={fieldName} labelText={labelText}>
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
    </FormFieldMui>
  );
};

export default RadioButtonGroupFormFieldMui;