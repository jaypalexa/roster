//import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from "@material-ui/core/RadioGroup";
import React from 'react';
import { Controller, useFormContext } from "react-hook-form";
//import FormFieldMui from './FormFieldMui';
import FormFieldMuiProps from './FormFieldMuiProps';

export const RadioButtonGroupFormFieldMui: React.FC<FormFieldMuiProps> = ({ fieldName, labelText, children }) => {
  const { control } = useFormContext();

  return (
    // <FormFieldMui fieldName={fieldName} labelText={labelText}>
    //   <FormLabel component='legend'>{labelText}</FormLabel>
    //     {children}
    // </FormFieldMui>

    <Controller
      name={fieldName}
      as={
        <RadioGroup>
          {children}
        </RadioGroup>
      }
      control={control}
    />
  );
};

export default RadioButtonGroupFormFieldMui;