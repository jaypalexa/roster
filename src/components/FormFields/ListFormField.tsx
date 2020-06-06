import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React from 'react';
import { Controller, useFormContext } from "react-hook-form";
import NameValuePair from '../../models/NameValuePair';
import FormField, { FormFieldProps } from './FormField';

interface ListFormFieldProps extends FormFieldProps {
  listItems: NameValuePair[];
}

export const ListFormField: React.FC<ListFormFieldProps> = ({fieldName, labelText, listItems, disabled, validationOptions}) => {
  const { control } = useFormContext();
  return (
    <FormField fieldName={fieldName} labelText={labelText}>
      <InputLabel htmlFor={fieldName} shrink={true}>{labelText}</InputLabel>
      <Controller
        as={
          <Select disabled={disabled}>
            {listItems.map((e, key) => {
              return <MenuItem key={key} value={e.value} disabled={disabled}>{e.name}</MenuItem>;
            })}
          </Select>
        }
        name={fieldName}
        control={control}
        rules={validationOptions}
        defaultValue=''
      />
    </FormField>
  );
};

export default ListFormField;