import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import sharedStyles from 'styles/sharedStyles';
import { FormFieldProps } from './FormField';
import TextFormField from './TextFormField';

interface TextareaFormFieldProps extends FormFieldProps {
  labelText?: string;
  maxLength?: number;
  placeholder?: string;
  readonly?: boolean;
  rows?: string | number | undefined;
  value?: string;
}

export const TextareaFormField: React.FC<TextareaFormFieldProps> = ({disabled, fieldName, labelText, maxLength, placeholder, readonly, rows, validationRules, value}) => {

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
      disabled={disabled}
      fieldClass={classes.textareaWrapper}
      fieldName={fieldName} 
      labelText={labelText} 
      maxLength={maxLength} 
      multiline={true} 
      placeholder={placeholder} 
      readonly={readonly}
      rows={rows} 
      validationRules={validationRules} 
      value={value} 
    />
  );
};

export default TextareaFormField;