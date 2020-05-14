import React from 'react';
import { useFormContext } from 'react-hook-form';
import NameValuePair from '../../models/NameValuePair';
import FormField from './FormField';
import FormFieldProps from './FormFieldProps';

interface ListFormFieldProps extends FormFieldProps {
  listItems: NameValuePair[];
}

export const ListFormField: React.FC<ListFormFieldProps> = ({fieldName, labelText, listItems, validationOptions}) => {
  const { register } = useFormContext();
  return (
    <FormField fieldName={fieldName} labelText={labelText}>
      <div className='select is-fullwidth'>
        <select name={fieldName} ref={register(validationOptions || {})}>
          {listItems.map((e, key) => {
            return <option key={key} value={e.value}>{e.name}</option>;
          })}
        </select>
      </div>
    </FormField>
  );
};

export default ListFormField;