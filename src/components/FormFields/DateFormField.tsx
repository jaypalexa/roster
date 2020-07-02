import React from 'react';
import { FormFieldProps } from './FormField';
import InputFormField from './InputFormField';

interface DateFormFieldProps extends FormFieldProps {
  labelText?: string;
  refObject?: any;
  value?: string | number | string[];
}

export const DateFormField: React.FC<DateFormFieldProps> = ({disabled, fieldName, labelText, refObject, validationRules, value}) => {
  return (
    <InputFormField 
      disabled={disabled}
      fieldName={fieldName} 
      labelText={labelText} 
      refObject={refObject}
      type='date' 
      validationRules={validationRules}
      value={value}
    />
  );
};

export default DateFormField;