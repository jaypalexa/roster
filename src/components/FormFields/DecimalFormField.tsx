import React from 'react';
import { FormFieldProps } from './FormField';
import InputFormField from './InputFormField';

interface DecimalFormFieldProps extends FormFieldProps {
  decimalPlaces: number;
  min?: number;
  max?: number;
}

export const DecimalFormField: React.FC<DecimalFormFieldProps> = ({fieldName, labelText, decimalPlaces, min, max, validationOptions, refObject}) => {
  const pattern = `^\\d+\\.?\\d{0,${decimalPlaces}}$`;
  const step = (1 / (10 ** decimalPlaces)).toString();
  const message = `Value cannot exceed ${decimalPlaces} decimal place${decimalPlaces === 1 ? '' : 's'}`;
  const decimalValidationOptions = { pattern: { value: new RegExp(pattern), message: message } };
  return (
      <InputFormField 
        fieldName={fieldName} 
        labelText={labelText} 
        validationOptions={Object.assign({}, validationOptions, decimalValidationOptions)}
        refObject={refObject}
        type='number' 
        min={min || 0} 
        max={max || 99999} 
        pattern={pattern}
        step={step}
      />
  );
};

export default DecimalFormField;