import React from 'react';
import { FormFieldMuiProps } from './FormFieldMui';
import InputFormFieldMui from './InputFormFieldMui';

interface TextFormFieldMuiProps extends FormFieldMuiProps {
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  value?: string;
  type?: string;
  multiline?: boolean;
  rows?: string | number | undefined;
}

export const TextFormFieldMui: React.FC<TextFormFieldMuiProps> = ({fieldName, labelText, placeholder, maxLength, disabled, value, type, multiline, rows, validationOptions, refObject}) => {
  return (
    <InputFormFieldMui 
      fieldName={fieldName} 
      labelText={labelText} 
      validationOptions={validationOptions}
      refObject={refObject}
      type={type || 'text'} 
      maxLength={maxLength}
      placeholder={placeholder} 
      disabled={disabled}
      value={value}
      multiline={multiline}
      rows={rows}
    />
  );
};

export default TextFormFieldMui;