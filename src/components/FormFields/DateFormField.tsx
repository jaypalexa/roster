import React from 'react';
import FormFieldProps from './FormFieldProps';
import InputFormField from './InputFormField';

interface DateFormFieldProps extends FormFieldProps {
  value?: string | number | string[];
}

export const DateFormField: React.FC<DateFormFieldProps> = ({fieldName, labelText, validationOptions, refObject, value}) => {
  return (
    <InputFormField 
      fieldName={fieldName} 
      labelText={labelText} 
      validationOptions={validationOptions}
      refObject={refObject}
      value={value}
      type='date' 
    />
  );
};

export default DateFormField;