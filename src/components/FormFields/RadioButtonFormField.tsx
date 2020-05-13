import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormFieldProps from './FormFieldProps';

interface RadioButtonFormFieldProps extends FormFieldProps {
  value?: string | number | string[] | undefined;
  defaultChecked?: boolean | undefined;
}

export const RadioButtonFormField: React.FC<RadioButtonFormFieldProps> = ({ fieldName, labelText, value, defaultChecked }) => {
  const { register } = useFormContext();
  return (
    <label className='radio'>
      <input type='radio' name={fieldName} value={value} ref={register({})} defaultChecked={defaultChecked} />
      {labelText}
    </label>
  );
};

export default RadioButtonFormField;