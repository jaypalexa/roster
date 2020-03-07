import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormField from './FormField';
import FormFieldProps from './FormFieldProps';

interface InputFormFieldProps extends FormFieldProps {
  type: string;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  disabled?: boolean;
  value?: string;
}

export const InputFormField: React.FC<InputFormFieldProps> = ({fieldName, labelText, validationOptions, type, placeholder, maxLength, min, max, pattern, disabled, value}) => {
  const { errors, formState, register } = useFormContext();
  return (
    <FormField fieldName={fieldName} labelText={labelText}>
      <input 
        name={fieldName} 
        className={`input ${validationOptions ? (errors[fieldName] && formState.dirty ? 'is-danger' : '') : ''}`}
        type={type}
        ref={register(validationOptions || {})}
        maxLength={maxLength}
        placeholder={placeholder || labelText} 
        min={min} 
        max={max} 
        pattern={pattern} 
        disabled={disabled} 
        value={value}
      />
    </FormField>
  );
};

export default InputFormField;
