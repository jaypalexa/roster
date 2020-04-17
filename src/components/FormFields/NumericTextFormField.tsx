import React from 'react';
import FormFieldProps from './FormFieldProps';
import InputFormField from './InputFormField';

interface NumericTextFormFieldProps extends FormFieldProps {
  min?: number;
  max?: number;
  pattern?: string;
}

export const NumericTextFormField: React.FC<NumericTextFormFieldProps> = ({fieldName, labelText, min, max, pattern, validationOptions, refObject}) => {
  return (
      <InputFormField 
        fieldName={fieldName} 
        labelText={labelText} 
        validationOptions={validationOptions}
        refObject={refObject}
        type='number' 
        min={min || 0} 
        max={max || 99999} 
        pattern={pattern || '\\d+'} 
      />
  );
};

export default NumericTextFormField;