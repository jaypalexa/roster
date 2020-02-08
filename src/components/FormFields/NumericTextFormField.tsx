import React from 'react';
import FormField from './FormField';
import FormFieldProps from './FormFieldProps';

interface NumericTextFormProps extends FormFieldProps {
  min?: number;
  max?: number;
}

export const NumericTextFormField: React.FC<NumericTextFormProps> = ({fieldName, labelText, min, max, reactHookFormProps, validationOptions}) => {
  return (
    <FormField fieldName={fieldName} labelText={labelText} reactHookFormProps={reactHookFormProps}>
      <input 
        name={fieldName} 
        className={`input ${validationOptions && reactHookFormProps.watch ? (!reactHookFormProps.watch(fieldName) ? 'is-danger' : '') : ''}`}
        type='number' 
        min={min || 0} 
        max={max} 
        pattern='\d+' 
        ref={reactHookFormProps.register(validationOptions || {})}
      />
    </FormField>
  );
};

export default NumericTextFormField;