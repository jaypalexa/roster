import React from 'react';
import FormFieldMuiProps from './FormFieldMuiProps';
import InputFormFieldMui from './InputFormFieldMui';

interface DateFormFieldMuiProps extends FormFieldMuiProps {
  value?: string | number | string[];
}

export const DateFormFieldMui: React.FC<DateFormFieldMuiProps> = ({fieldName, labelText, validationOptions, refObject, value}) => {
  return (
    <InputFormFieldMui 
      fieldName={fieldName} 
      labelText={labelText} 
      validationOptions={validationOptions}
      refObject={refObject}
      value={value}
      type='date' 
    />
  );
};

export default DateFormFieldMui;