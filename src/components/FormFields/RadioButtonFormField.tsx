import React from 'react';
import FormFieldProps from './FormFieldProps';

interface RadioButtonFormFieldProps extends FormFieldProps {
  value?: string | number | string[] | undefined;
}

export const RadioButtonFormField: React.FC<RadioButtonFormFieldProps> = ({ fieldName, labelText, value, reactHookFormProps }) => {
  return (
    <label className='radio'>
      <input type='radio' name={fieldName} value={value} ref={reactHookFormProps.register({})} />
      {labelText}
    </label>
  );
};

export default RadioButtonFormField;