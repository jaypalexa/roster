import React from 'react';
import { FormFieldProps } from './FormField';
import TextFormField from './TextFormField';

interface TextareaFormFieldProps extends FormFieldProps {
  placeholder?: string;
  maxLength?: number;
  rows?: string | number | undefined;
  disabled?: boolean;
  readonly?: boolean;
  value?: string;
}

export const TextareaFormField: React.FC<TextareaFormFieldProps> = ({fieldName, labelText, validationOptions, placeholder, maxLength, rows, disabled, readonly, value}) => {
  return (
    <TextFormField 
      fieldName={fieldName} 
      labelText={labelText} 
      multiline={true} 
      validationOptions={validationOptions} 
      placeholder={placeholder} 
      maxLength={maxLength} 
      rows={rows} 
      disabled={disabled}
      readonly={readonly}
      value={value}
      />
  );
};

export default TextareaFormField;