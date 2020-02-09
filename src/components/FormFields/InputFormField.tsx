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
}

export const InputFormField: React.FC<InputFormFieldProps> = ({fieldName, labelText, validationOptions, type, placeholder, maxLength, min, max, pattern}) => {
  const { register, watch } = useFormContext();
  return (
    <FormField fieldName={fieldName} labelText={labelText}>
      <input 
        name={fieldName} 
        className={`input ${validationOptions && watch ? (!watch(fieldName) ? 'is-danger' : '') : ''}`}
        type={type}
        ref={register(validationOptions || {})}
        maxLength={maxLength}
        placeholder={placeholder || labelText} 
        min={min} 
        max={max} 
        pattern={pattern} 
      />
    </FormField>
  );
};

export default InputFormField;
