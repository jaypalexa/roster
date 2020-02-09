import React from 'react';
import FormField from './FormField';
import FormFieldProps from './FormFieldProps';

export const RadioButtonGroupFormField: React.FC<FormFieldProps> = ({ fieldName, labelText, children }) => {
  return (
    <FormField fieldName={fieldName} labelText={labelText}>
      {children}
    </FormField>
  );
};

export default RadioButtonGroupFormField;