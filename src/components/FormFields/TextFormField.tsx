import React from 'react';
import { FormFieldProps } from './FormField';
import InputFormField from './InputFormField';

interface TextFormFieldProps extends FormFieldProps {
  labelText?: string;
  maxLength?: number;
  multiline?: boolean;
  placeholder?: string;
  readonly?: boolean;
  refObject?: any;
  rows?: string | number | undefined;
  type?: string;
  value?: string;
}

export const TextFormField: React.FC<TextFormFieldProps> = ({disabled, fieldClass, fieldName, labelText, maxLength, multiline, placeholder, readonly, refObject, rows, type, validationRules, value}) => {
  return (
    <InputFormField 
      disabled={disabled}
      fieldClass={fieldClass}
      fieldName={fieldName} 
      labelText={labelText} 
      maxLength={maxLength}
      multiline={multiline}
      placeholder={placeholder} 
      readonly={readonly}
      refObject={refObject}
      rows={rows}
      type={type || 'text'} 
      validationRules={validationRules}
      value={value}
    />
  );
};

export default TextFormField;