import React from 'react';
import { ErrorMessage, useFormContext } from 'react-hook-form';
import './FormField.sass';
import FormFieldProps from './FormFieldProps';

export const FormField: React.FC<FormFieldProps> = ({ fieldName, fieldClass, labelText, children }) => {
  const { errors } = useFormContext();
  return (
    <div className={`field ${fieldClass || ''}`}>
      <label className={`label ${labelText ? '' : 'hidden-when-mobile'}`}>{labelText || <span>&nbsp;</span>}</label>
      <div className='control is-expanded'>
        {children}
      </div>
      <ErrorMessage errors={errors} name={fieldName} as='p' className='help has-text-danger' />
    </div>
  );
};

export default FormField;