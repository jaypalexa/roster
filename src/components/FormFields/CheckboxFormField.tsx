import React from 'react';
import { ErrorMessage, useFormContext } from 'react-hook-form';
import './CheckboxFormField.sass';
import FormFieldProps from './FormFieldProps';

interface CheckboxFormFieldProps extends FormFieldProps {
  disabled?: boolean;
  value?: string;
}

export const CheckboxFormField: React.FC<CheckboxFormFieldProps> = ({fieldName, labelText, disabled, value, validationOptions}) => {
  const { errors, formState, register } = useFormContext();
  return (
    <div className='field'>
      <input 
        id={fieldName}
        name={fieldName} 
        className={`checkbox ${validationOptions ? (errors[fieldName] && formState.dirty ? 'is-danger' : '') : ''}`}
        type='checkbox'
        ref={register(validationOptions || {})}
        disabled={disabled} 
        value={value}
      />
      <label htmlFor={fieldName}>{labelText}</label>
      <ErrorMessage errors={errors} name={fieldName} as='p' className='help has-text-danger' />
    </div>
  );
};

export default CheckboxFormField;