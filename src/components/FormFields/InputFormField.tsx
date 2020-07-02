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
  labelText?: string;
  max?: number;
  maxLength?: number;
  min?: number;
  multiline?: boolean;
  pattern?: string;
  placeholder?: string;
  readonly?: boolean;
  refObject?: any;
  rows?: string | number | undefined;
  step?: string;
  type: string;
  value?: string | number | string[];
}

export const InputFormField: React.FC<InputFormFieldProps> = ({disabled, fieldClass, fieldName, labelText, max, maxLength, min, multiline, pattern, placeholder, readonly, refObject, rows, step, type, validationRules, value}) => {

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
    <FormField fieldName={fieldName}>
      <InputLabel htmlFor={fieldName} shrink={true}>{labelText}</InputLabel>
      <Input 
        className={clsx(fieldClass, (readonly ? classes.readOnlyField : ''))} 
        defaultValue={value}
        disabled={disabled}
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
        id={fieldName} 
        inputProps={{
          max: max || 255,
          maxLength: maxLength,
          min: min,
          pattern: pattern,
          step: step,
        }}
        inputRef={(e) => {
          if (e) {
            register(e, validationRules || {});
            if (refObject) {
              refObject.current = e;
            }
          }
        }}
        multiline={multiline}
        name={fieldName}
        placeholder={placeholder}
        readOnly={readonly}
        rows={rows || 3}
        type={isPasswordType ? (isPasswordVisible ? 'text' : 'password') : type}
      />
    </FormField>
  );
};

export default InputFormField;
