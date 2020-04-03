import React from 'react';
import FormFieldProps from './FormFieldProps';
import InputFormField from './InputFormField';

interface NumericTextFormFieldProps extends FormFieldProps {
  min?: number;
  max?: number;
}

export const NumericTextFormField: React.FC<NumericTextFormFieldProps> = ({fieldName, labelText, min, max, validationOptions, refObject}) => {
  return (
      <InputFormField 
        fieldName={fieldName} 
        labelText={labelText} 
        validationOptions={validationOptions}
        refObject={refObject}
        type='number' 
        min={min || 0} 
        max={max} 
        pattern='\d+' 
      />
  );
};

export default NumericTextFormField;