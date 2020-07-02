import React from 'react';
import { constants } from 'utils';
import { FormFieldProps } from './FormField';
import InputFormField from './InputFormField';

interface IntegerFormFieldProps extends FormFieldProps {
  labelText?: string;
  max?: number;
  min?: number;
  refObject?: any;
}

export const IntegerFormField: React.FC<IntegerFormFieldProps> = ({disabled, fieldName, labelText, min, max, refObject, validationRules}) => {
  return (
    <InputFormField 
      disabled={disabled}
      fieldName={fieldName} 
      labelText={labelText} 
      max={max || 99999} 
      min={min || 0} 
      pattern={constants.INPUT_NUMBER_PATTERN.ZERO_DECIMAL_PLACES}
      refObject={refObject}
      type='number' 
      validationRules={validationRules}
    />
  );
};

export default IntegerFormField;