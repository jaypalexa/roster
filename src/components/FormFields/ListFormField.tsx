import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React from 'react';
import { Controller, useFormContext } from "react-hook-form";
import NameValuePair from '../../models/NameValuePair';
import FormField, { FormFieldProps } from './FormField';

interface ListFormFieldProps extends FormFieldProps {
  labelText?: string;
  listItems: NameValuePair[];
  refObject?: any;
}

export const ListFormField: React.FC<ListFormFieldProps> = ({disabled, fieldName, labelText, listItems, refObject, validationRules}) => {
  const { control } = useFormContext();
  return (
    <FormField fieldName={fieldName}>
      <InputLabel htmlFor={fieldName} shrink={true}>{labelText}</InputLabel>
      <Controller
        as={
          <Select disabled={disabled} ref={refObject}>
            {listItems.map((e, key) => {
              return <MenuItem key={key} value={e.value} disabled={disabled}>{e.name}</MenuItem>;
            })}
          </Select>
        }
        control={control}
        defaultValue=''
        name={fieldName}
        rules={validationRules}
      />
    </FormField>
  );
};

export default ListFormField;