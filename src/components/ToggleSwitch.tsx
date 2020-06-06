import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import React from 'react';

interface ToggleSwitchProps {
  name?: string;
  labelText?: string;
  checked?: boolean;
  onChange?: ((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void);
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ name, labelText, checked, onChange }) => {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={onChange} name={name} color='primary' />}
      label={labelText}
    />
  );
};

export default ToggleSwitch;