import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormField from './FormField';
import FormFieldProps from './FormFieldProps';

interface TextareaFormFieldProps extends FormFieldProps {
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  rows?: number;
  disabled?: boolean;
  value?: string;
}

export const TextareaFormField: React.FC<TextareaFormFieldProps> = ({fieldName, labelText, validationOptions, placeholder, minLength, maxLength, rows, disabled, value}) => {
  const { errors, formState, register } = useFormContext();
  return (
    <FormField fieldName={fieldName} labelText={labelText}>
      <textarea 
        name={fieldName} 
        className={`textarea ${validationOptions ? (errors[fieldName] && formState.dirty ? 'is-danger' : '') : ''}`}
        ref={register(validationOptions || {})}
        minLength={minLength} 
        maxLength={maxLength || 255}
        placeholder={placeholder || labelText} 
        rows={rows || 3} 
        disabled={disabled} 
        value={value}
      />
    </FormField>
  );
};

export default TextareaFormField;
