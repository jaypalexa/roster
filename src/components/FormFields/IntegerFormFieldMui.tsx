import React from 'react';
import { constants } from 'utils';
import FormFieldMuiProps from './FormFieldMuiProps';
import InputFormFieldMui from './InputFormFieldMui';

interface IntegerFormFieldMuiProps extends FormFieldMuiProps {
  min?: number;
  max?: number;
}

export const IntegerFormFieldMui: React.FC<IntegerFormFieldMuiProps> = ({fieldName, labelText, min, max, validationOptions, refObject}) => {
  return (
    <InputFormFieldMui 
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

export default IntegerFormFieldMui;