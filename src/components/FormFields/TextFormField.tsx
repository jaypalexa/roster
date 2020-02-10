import React from 'react';
import FormFieldProps from './FormFieldProps';
import InputFormField from './InputFormField';

interface TextFormFieldProps extends FormFieldProps {
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  value?: string;
}

export const TextFormField: React.FC<TextFormFieldProps> = ({fieldName, labelText, placeholder, maxLength, disabled, value, validationOptions}) => {
  return (
    <InputFormField 
      fieldName={fieldName} 
      labelText={labelText} 
      validationOptions={validationOptions}
      type='text' 
      maxLength={maxLength}
      placeholder={placeholder} 
      disabled={disabled}
      value={value}
    />
  );
};

export default TextFormField;