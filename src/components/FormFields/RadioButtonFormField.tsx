import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormFieldProps from './FormFieldProps';

interface RadioButtonFormFieldProps extends FormFieldProps {
  value?: string | number | string[] | undefined;
}

export const RadioButtonFormField: React.FC<RadioButtonFormFieldProps> = ({ fieldName, labelText, value }) => {
  const { register } = useFormContext();
  return (
    <label className='radio'>
      <input type='radio' name={fieldName} value={value} ref={register({})} />
      {labelText}
    </label>
  );
};

export default RadioButtonFormField;