import React from 'react';
import FormField from './FormField';
import FormFieldProps from './FormFieldProps';

interface DateFormProps extends FormFieldProps {
}

export const DateFormField: React.FC<DateFormProps> = ({fieldName, labelText, reactHookFormProps, validationOptions}) => {
  return (
    <FormField fieldName={fieldName} labelText={labelText} reactHookFormProps={reactHookFormProps}>
      <input 
        name={fieldName} 
        className={`input ${validationOptions && reactHookFormProps.watch ? (!reactHookFormProps.watch(fieldName) ? 'is-danger' : '') : ''}`}
        type='date' 
        ref={reactHookFormProps.register(validationOptions || {})}
      />
    </FormField>
  );
};

export default DateFormField;