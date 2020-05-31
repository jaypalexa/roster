import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import React from 'react';

interface RadioButtonFormFieldMuiProps {
  labelText?: string;
  value?: string;
}

export const RadioButtonFormFieldMui: React.FC<RadioButtonFormFieldMuiProps> = ({ labelText, value }) => {
  return (
    <FormControlLabel label={labelText} value={value} control={<Radio color='primary' />} />
  );
};

export default RadioButtonFormFieldMui;