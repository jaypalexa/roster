import useMount from 'hooks/UseMount';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import FormField from './FormField';
import FormFieldProps from './FormFieldProps';
import './InputFormField.sass';

interface InputFormFieldProps extends FormFieldProps {
  type: string;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  step?: string;
  disabled?: boolean;
  value?: string;
}

export const InputFormField: React.FC<InputFormFieldProps> = ({fieldName, labelText, validationOptions, refObject, type, placeholder, maxLength, min, max, pattern, step, disabled, value}) => {
  const { errors, formState, register } = useFormContext();
  const [isPasswordType, setIsPasswordType] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useMount(() => {
    setIsPasswordType(type === 'password');
  });

  const togglePasswordVisiblity = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <FormField fieldName={fieldName} labelText={labelText}>
      <input 
        name={fieldName} 
        className={`input ${validationOptions ? (errors[fieldName] && formState.dirty ? 'is-danger' : '') : ''}`}
        type={isPasswordType ? (isPasswordVisible ? 'text' : 'password') : type}
        ref={(e) => {
          if (e) {
            register(e, validationOptions || {});
            if (refObject) {
              refObject.current = e;
            }
          }
        }}
        maxLength={maxLength || 255}
        placeholder={placeholder || labelText} 
        min={min} 
        max={max || 255} 
        pattern={pattern} 
        step={step} 
        disabled={disabled} 
        value={value} 
      />
      {isPasswordType ? <i className='fa fa-eye input-visibility-toggle-icon' onClick={togglePasswordVisiblity} title='Toggle visibility'></i> : null}
    </FormField>
  );
};

export default InputFormField;
