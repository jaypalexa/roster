import React from 'react';
import FormFieldProps from './FormFieldProps';

export const FormField: React.FC<FormFieldProps> = ({ fieldName, labelText, reactHookFormProps, children }) => {
  return (
    <div className='field'>
      <label className={`label ${labelText ? '' : 'hidden'}`}>{labelText}</label>
      <div className='control is-expanded'>
        {children}
      </div>
      { reactHookFormProps.errors && 
        <p className='help has-text-danger'>{reactHookFormProps.errors[fieldName] && reactHookFormProps.errors[fieldName]!.message}</p>
      }
    </div>
  );
};

export default FormField;