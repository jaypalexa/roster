import { Checkbox, FormControlLabel, FormHelperText, Grid } from '@material-ui/core';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormFieldProps } from './FormField';

interface CheckboxFormFieldProps extends FormFieldProps {
  labelText?: string;
  value?: string;
}

export const CheckboxFormField: React.FC<CheckboxFormFieldProps> = ({disabled, fieldName, labelText, validationRules, value}) => {
  const { control, errors } = useFormContext();
  return (
    <Grid item xs={12} md>
      <Controller 
        control={control}
        name={fieldName} 
        rules={validationRules}
        as={
          <FormControlLabel
            label={labelText}
            control={<Checkbox
              color='primary'
              disabled={disabled}
              id={fieldName}
              name={fieldName} 
              value={value}
            />}
          />
        }
      />
      <FormHelperText id={`${fieldName}-helper-text`}>{errors[fieldName]?.message}</FormHelperText>
    </Grid>
  );
};

export default CheckboxFormField;