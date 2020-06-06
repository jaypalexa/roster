import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import React from 'react';

interface RadioButtonFormFieldProps {
  labelText?: string;
  value?: string;
}

export const RadioButtonFormField: React.FC<RadioButtonFormFieldProps> = ({ labelText, value }) => {
  return (
    <FormControlLabel label={labelText} value={value} control={<Radio color='primary' />} />
  );
};

export default RadioButtonFormField;