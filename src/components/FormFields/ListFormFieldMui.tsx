import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React from 'react';
import { Controller, useFormContext } from "react-hook-form";
import NameValuePair from '../../models/NameValuePair';
import FormFieldMui, { FormFieldMuiProps } from './FormFieldMui';

interface ListFormFieldMuiProps extends FormFieldMuiProps {
  listItems: NameValuePair[];
}

export const ListFormFieldMui: React.FC<ListFormFieldMuiProps> = ({fieldName, labelText, listItems, validationOptions}) => {
  const { control } = useFormContext();
  return (
    <FormFieldMui fieldName={fieldName} labelText={labelText}>
      <InputLabel htmlFor={fieldName} shrink={true}>{labelText}</InputLabel>
      <Controller
        as={
          <Select>
            {listItems.map((e, key) => {
              return <MenuItem key={key} value={e.value}>{e.name}</MenuItem>;
            })}
          </Select>
        }
        name={fieldName}
        control={control}
        defaultValue=''
      />
    </FormFieldMui>
  );
};

export default ListFormFieldMui;