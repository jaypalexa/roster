import React from 'react';
import Constants from '../../constants';
import FormFieldProps from './FormFieldProps';
import InputFormField from './InputFormField';

interface NumericFormFieldProps extends FormFieldProps {
  min?: number;
  max?: number;
  pattern?: string;
  step?: string;
}

export const NumericFormField: React.FC<NumericFormFieldProps> = ({fieldName, labelText, min, max, pattern, step, validationOptions, refObject}) => {
  return (
      <InputFormField 
        fieldName={fieldName} 
        labelText={labelText} 
        validationOptions={validationOptions}
        refObject={refObject}
        type='number' 
        min={min || 0} 
        max={max || 99999} 
        pattern={pattern || Constants.INPUT_NUMBER_PATTERN.ZERO_DECIMAL_PLACES}
        step={step || '1'}
      />
  );
};

export default NumericFormField;