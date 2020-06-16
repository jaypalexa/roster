import React from 'react';
import { FormFieldProps } from './FormField';
import InputFormField from './InputFormField';

interface TextFormFieldProps extends FormFieldProps {
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  readonly?: boolean;
  value?: string;
  type?: string;
  multiline?: boolean;
  rows?: string | number | undefined;
}

export const TextFormField: React.FC<TextFormFieldProps> = ({fieldName, labelText, placeholder, maxLength, disabled, readonly, value, type, multiline, rows, validationOptions, refObject}) => {
  return (
    <InputFormField 
      fieldName={fieldName} 
      labelText={labelText} 
      validationOptions={validationOptions}
      refObject={refObject}
      type={type || 'text'} 
      maxLength={maxLength}
      placeholder={placeholder} 
      disabled={disabled}
      readonly={readonly}
      value={value}
      multiline={multiline}
      rows={rows}
    />
  );
};

export default TextFormField;