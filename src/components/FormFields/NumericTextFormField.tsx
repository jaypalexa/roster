import React from 'react';
import FormFieldProps from './FormFieldProps';
import InputFormField from './InputFormField';

interface NumericTextFormFieldProps extends FormFieldProps {
  min?: number;
  max?: number;
}
export const NumericTextFormField: React.FC<NumericTextFormFieldProps> = ({fieldName, labelText, min, max, reactHookFormProps, validationOptions}) => {
  return (
      <InputFormField 
        fieldName={fieldName} 
        labelText={labelText} 
        reactHookFormProps={reactHookFormProps}
        validationOptions={validationOptions}
        type='number' 
        min={min || 0} 
        max={max} 
        pattern='\d+' 
      />
  );
};

export default NumericTextFormField;