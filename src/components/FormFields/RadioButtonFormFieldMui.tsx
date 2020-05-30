import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import React from 'react';
//import { useFormContext } from 'react-hook-form';
import FormFieldMuiProps from './FormFieldMuiProps';

interface RadioButtonFormFieldMuiProps extends FormFieldMuiProps {
  value?: string;
  defaultChecked?: boolean | undefined;
}

export const RadioButtonFormFieldMui: React.FC<RadioButtonFormFieldMuiProps> = ({ fieldName, labelText, value, defaultChecked }) => {
  // const { register } = useFormContext();

  // const [selectedValue, setSelectedValue] = useState(value);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelectedValue(event.target.value);
  // };
  return (
    <FormControlLabel 
      value={value} 
      control={
        <Radio
          color='primary'
          value={value}
          name={fieldName}
          inputProps={{ 'aria-label': labelText }}
          //inputRef={register}
          defaultChecked={defaultChecked}
          //checked={selectedValue === 'I'}
          //onChange={handleChange}
        />
      } 
      label={labelText}
    />
    // <Radio
    //   // checked={selectedValue === 'a'}
    //   // onChange={handleChange}
    //   value={value}
    //   name={fieldName}
    //   inputProps={{ 'aria-label': labelText }}
    //   inputRef={(e) => {register({})}}
    //   defaultChecked={defaultChecked}
    // />
    // <label className='radio'>
    //   <input type='radio' name={fieldName} value={value} ref={register({})} defaultChecked={defaultChecked} />
    //   {labelText}
    // </label>
  );
};

export default RadioButtonFormFieldMui;