import React from 'react';
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

export const InputFormField: React.FC<InputFormFieldProps> = ({fieldName, labelText, reactHookFormProps, validationOptions, type, placeholder, maxLength, min, max, pattern}) => {
  return (
    <FormField fieldName={fieldName} labelText={labelText} reactHookFormProps={reactHookFormProps}>
      <input 
        name={fieldName} 
        className={`input ${validationOptions && reactHookFormProps.watch ? (!reactHookFormProps.watch(fieldName) ? 'is-danger' : '') : ''}`}
        type={type}
        ref={reactHookFormProps.register(validationOptions || {})}
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
