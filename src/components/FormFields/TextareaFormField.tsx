import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import sharedStyles from 'styles/sharedStyles';
import { FormFieldProps } from './FormField';
import TextFormField from './TextFormField';

interface TextareaFormFieldProps extends FormFieldProps {
  placeholder?: string;
  maxLength?: number;
  rows?: string | number | undefined;
  disabled?: boolean;
  readonly?: boolean;
  value?: string;
}

export const TextareaFormField: React.FC<TextareaFormFieldProps> = ({fieldName, labelText, validationOptions, placeholder, maxLength, rows, disabled, readonly, value}) => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      ...sharedStyles(theme),
      textareaWrapper: {
        '& textarea' : {
          overflowX: 'scroll',
          whiteSpace: 'pre',
        }
      },
    })
  );
  const classes = useStyles();

  return (
    <TextFormField 
      fieldName={fieldName} 
      labelText={labelText} 
      multiline={true} 
      validationOptions={validationOptions} 
      placeholder={placeholder} 
      maxLength={maxLength} 
      rows={rows} 
      disabled={disabled}
      readonly={readonly}
      value={value} 
      fieldClass={classes.textareaWrapper}
      />
  );
};

export default TextareaFormField;