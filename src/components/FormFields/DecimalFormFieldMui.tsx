import React from 'react';
import { FormFieldMuiProps } from './FormFieldMui';
import InputFormFieldMui from './InputFormFieldMui';

interface DecimalFormFieldMuiProps extends FormFieldMuiProps {
  decimalPlaces: number;
  min?: number;
  max?: number;
}

export const DecimalFormFieldMui: React.FC<DecimalFormFieldMuiProps> = ({fieldName, labelText, decimalPlaces, min, max, validationOptions, refObject}) => {
  const pattern = `^\\d+\\.?\\d{0,${decimalPlaces}}$`;
  const step = (1 / (10 ** decimalPlaces)).toString();
  const message = `Value cannot exceed ${decimalPlaces} decimal place${decimalPlaces === 1 ? '' : 's'}`;
  const decimalValidationOptions = { pattern: { value: new RegExp(pattern), message: message } };
  return (
      <InputFormFieldMui 
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

export default DecimalFormFieldMui;