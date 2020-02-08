import React from 'react';
import FormFieldProps from './FormFieldProps';
import InputFormField from './InputFormField';

export const DateFormField: React.FC<FormFieldProps> = ({fieldName, labelText, reactHookFormProps, validationOptions}) => {
  return (
    <InputFormField 
      fieldName={fieldName} 
      labelText={labelText} 
      reactHookFormProps={reactHookFormProps}
      validationOptions={validationOptions}
      type='date' 
    />
  );
};

export default DateFormField;