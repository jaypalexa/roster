import React from 'react';
import { FormFieldProps } from './FormField';
import InputFormField from './InputFormField';

interface DecimalFormFieldProps extends FormFieldProps {
  decimalPlaces: number;
  labelText?: string;
  max?: number;
  min?: number;
  refObject?: any;
}

export const DecimalFormField: React.FC<DecimalFormFieldProps> = ({disabled, decimalPlaces, fieldName, labelText, max, min, refObject, validationRules}) => {
  const pattern = `^\\d+\\.?\\d{0,${decimalPlaces}}$`;
  const step = (1 / (10 ** decimalPlaces)).toString();
  const message = `Value cannot exceed ${decimalPlaces} decimal place${decimalPlaces === 1 ? '' : 's'}`;
  const decimalValidationOptions = { pattern: { value: new RegExp(pattern), message: message } };
  return (
      <InputFormField 
        disabled={disabled}
        fieldName={fieldName} 
        labelText={labelText} 
        max={max || 99999} 
        min={min || 0} 
        pattern={pattern}
        refObject={refObject}
        step={step}
        type='number' 
        validationRules={Object.assign({}, validationRules, decimalValidationOptions)}
      />
  );
};

export default DecimalFormField;