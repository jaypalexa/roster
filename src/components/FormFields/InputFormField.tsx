import { createStyles, makeStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import clsx from 'clsx';
import useMount from 'hooks/UseMount';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import sharedStyles from 'styles/sharedStyles';
import FormField, { FormFieldProps } from './FormField';

interface InputFormFieldProps extends FormFieldProps {
  type: string;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  step?: string;
  disabled?: boolean;
  readonly?: boolean;
  value?: string | number | string[];
  multiline?: boolean;
  rows?: string | number | undefined;
}

export const InputFormField: React.FC<InputFormFieldProps> = ({fieldName, labelText, validationOptions, refObject, type, placeholder, maxLength, min, max, pattern, step, disabled, readonly, value, multiline, rows, fieldClass}) => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      ...sharedStyles(theme),
      readOnlyField: {
        backgroundColor: 'whitesmoke',
        paddingLeft: '.25rem',
      },
    })
  );
  const classes = useStyles();

  const { register } = useFormContext();
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
      <InputLabel htmlFor={fieldName} shrink={true}>{labelText}</InputLabel>
      <Input 
        id={fieldName} 
        name={fieldName}
        type={isPasswordType ? (isPasswordVisible ? 'text' : 'password') : type}
        defaultValue={value}
        multiline={multiline}
        rows={rows || 3}
        readOnly={readonly}
        disabled={disabled}
        placeholder={placeholder}
        inputRef={(e) => {
          if (e) {
            register(e, validationOptions || {});
            if (refObject) {
              refObject.current = e;
            }
          }
        }}
        inputProps={{
          min: min,
          max: max || 255,
          maxLength: maxLength,
          pattern: pattern,
          step: step,
        }}
        endAdornment={
          isPasswordType
            ? <InputAdornment position="end">
                <IconButton
                  aria-label="Password Visibility Toggle"
                  onClick={togglePasswordVisiblity}
                  onMouseDown={togglePasswordVisiblity}
                >
                  {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            : null
        }
        className={clsx(fieldClass, (readonly ? classes.readOnlyField : ''))} 
      />
    </FormField>
  );
};

export default InputFormField;
