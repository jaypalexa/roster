import React from 'react';
import FormFieldProps from './FormFieldProps';
import InputFormField from './InputFormField';

interface TextFormFieldProps extends FormFieldProps {
  placeholder?: string;
  maxLength?: number;
}

export const TextFormField: React.FC<TextFormFieldProps> = ({fieldName, labelText, placeholder, maxLength, reactHookFormProps, validationOptions}) => {
  return (
    <InputFormField 
      fieldName={fieldName} 
      labelText={labelText} 
      reactHookFormProps={reactHookFormProps}
      validationOptions={validationOptions}
      type='text' 
      maxLength={maxLength}
      placeholder={placeholder} 
    />
  );
};

export default TextFormField;