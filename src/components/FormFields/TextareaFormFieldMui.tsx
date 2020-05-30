import React from 'react';
import FormFieldMuiProps from './FormFieldMuiProps';
import TextFormFieldMui from './TextFormFieldMui';

interface TextareaFormFieldMuiProps extends FormFieldMuiProps {
  placeholder?: string;
  maxLength?: number;
  rows?: string | number | undefined;
  disabled?: boolean;
  value?: string;
}

export const TextareaFormFieldMui: React.FC<TextareaFormFieldMuiProps> = ({fieldName, labelText, validationOptions, placeholder, maxLength, rows, disabled, value}) => {
  return (
    <TextFormFieldMui 
      fieldName={fieldName} 
      labelText={labelText} 
      multiline={true} 
      validationOptions={validationOptions} 
      placeholder={placeholder} 
      maxLength={maxLength} 
      rows={rows} 
      disabled={disabled}
      value={value}
      />
  );
};

export default TextareaFormFieldMui;