import React from 'react';
import './FormFieldGroup.sass';

interface FormFieldGroupProps {
  fieldClass?: string;
  labelText?: string;
}

export const FormFieldGroup: React.FC<FormFieldGroupProps> = ({ fieldClass, labelText, children }) => {
  return (
    <div className={`field ${fieldClass || ''}`}>
      <label className={`label ${labelText ? '' : 'hidden'}`}>{labelText}</label>
      <div className='control is-expanded'>
        {children}
      </div>
    </div>
  );
};

export default FormFieldGroup;