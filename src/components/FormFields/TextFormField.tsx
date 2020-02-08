import React from 'react';
import FormField from './FormField';
import FormFieldProps from './FormFieldProps';

interface TextFormFieldProps extends FormFieldProps {
  placeholder?: string;
  maxLength?: number;
}

export const TextFormField: React.FC<TextFormFieldProps> = ({fieldName, labelText, placeholder, maxLength, reactHookFormProps, validationOptions}) => {
  return (
    <FormField fieldName={fieldName} labelText={labelText} reactHookFormProps={reactHookFormProps}>
      <input 
        name={fieldName} 
        className={`input ${validationOptions && reactHookFormProps.watch ? (!reactHookFormProps.watch(fieldName) ? 'is-danger' : '') : ''}`}
        type='text' 
        placeholder={placeholder || labelText} 
        ref={reactHookFormProps.register(validationOptions || {})}
        maxLength={maxLength}
      />
    </FormField>
  );
};

export default TextFormField;