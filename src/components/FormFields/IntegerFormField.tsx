import React from 'react';
import { constants } from 'utils';
import { FormFieldProps } from './FormField';
import InputFormField from './InputFormField';

interface IntegerFormFieldProps extends FormFieldProps {
  min?: number;
  max?: number;
}

export const IntegerFormField: React.FC<IntegerFormFieldProps> = ({fieldName, labelText, min, max, validationOptions, refObject}) => {
  return (
    <InputFormField 
      fieldName={fieldName} 
      labelText={labelText} 
      validationOptions={validationOptions}
      refObject={refObject}
      type='number' 
      min={min || 0} 
      max={max || 99999} 
      pattern={constants.INPUT_NUMBER_PATTERN.ZERO_DECIMAL_PLACES}
    />
  );
};

export default IntegerFormField;