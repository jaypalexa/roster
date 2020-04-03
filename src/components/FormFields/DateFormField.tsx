import React from 'react';
import FormFieldProps from './FormFieldProps';
import InputFormField from './InputFormField';

export const DateFormField: React.FC<FormFieldProps> = ({fieldName, labelText, validationOptions, refObject}) => {
  return (
    <InputFormField 
      fieldName={fieldName} 
      labelText={labelText} 
      validationOptions={validationOptions}
      refObject={refObject}
      type='date' 
    />
  );
};

export default DateFormField;