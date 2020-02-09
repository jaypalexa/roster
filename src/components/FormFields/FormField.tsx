import React from 'react';
import { ErrorMessage, useFormContext } from 'react-hook-form';
import FormFieldProps from './FormFieldProps';

export const FormField: React.FC<FormFieldProps> = ({ fieldName, labelText, children }) => {
  const { errors } = useFormContext();
  return (
    <div className='field'>
      <label className={`label ${labelText ? '' : 'hidden'}`}>{labelText}</label>
      <div className='control is-expanded'>
        {children}
      </div>
      <ErrorMessage errors={errors} name={fieldName} as='p' className='help has-text-danger' />
    </div>
  );
};

export default FormField;