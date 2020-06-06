import { Checkbox, FormControlLabel, FormHelperText, Grid } from '@material-ui/core';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormFieldProps } from './FormField';

interface CheckboxFormFieldProps extends FormFieldProps {
  disabled?: boolean;
  value?: string;
}

export const CheckboxFormField: React.FC<CheckboxFormFieldProps> = ({fieldName, labelText, disabled, value, validationOptions}) => {
  const { control, errors } = useFormContext();
  return (
    <Grid item xs={12} md>
      <Controller 
        name={fieldName} 
        control={control}
        rules={validationOptions}
        as={
          <FormControlLabel
            label={labelText}
            control={<Checkbox
              id={fieldName}
              name={fieldName} 
              color='primary'
              disabled={disabled}
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