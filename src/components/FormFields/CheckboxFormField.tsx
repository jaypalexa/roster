import { Grid } from '@material-ui/core';
import React from 'react';
import { ErrorMessage, useFormContext } from 'react-hook-form';
import './CheckboxFormField.sass';
import FormFieldProps from './FormFieldProps';

interface CheckboxFormFieldProps extends FormFieldProps {
  disabled?: boolean;
  value?: string;
  defaultChecked?: boolean | undefined;
}

export const CheckboxFormField: React.FC<CheckboxFormFieldProps> = ({fieldName, labelText, disabled, value, defaultChecked, validationOptions}) => {
  const { errors, formState, register } = useFormContext();
  return (
    <Grid item xs={12} md>
      <input 
        id={fieldName}
        name={fieldName} 
        className={`checkbox ${validationOptions ? (errors[fieldName] && formState.dirty ? 'is-danger' : '') : ''}`}
        type='checkbox'
        ref={register(validationOptions || {})}
        disabled={disabled} 
        value={value}
        defaultChecked={defaultChecked}
      />
      <label htmlFor={fieldName}>{labelText}</label>
      <ErrorMessage errors={errors} name={fieldName} as='p' className='help has-text-danger' />
    </Grid>
  );
};

export default CheckboxFormField;