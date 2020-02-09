import React from 'react';
import FormFieldProps from './FormFieldProps';
import InputFormField from './InputFormField';

export const DateFormField: React.FC<FormFieldProps> = ({fieldName, labelText, validationOptions}) => {
  return (
    <InputFormField 
      fieldName={fieldName} 
      labelText={labelText} 
      validationOptions={validationOptions}
      type='date' 
    />
  );
};

export default DateFormField;