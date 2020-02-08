import React from 'react';
import NameValuePair from '../../types/NameValuePair';
import FormField from './FormField';
import FormFieldProps from './FormFieldProps';

interface ListFormFieldProps extends FormFieldProps {
  listItems: NameValuePair[];
}

export const ListFormField: React.FC<ListFormFieldProps> = ({fieldName, labelText, listItems, reactHookFormProps, validationOptions}) => {
  return (
    <FormField fieldName={fieldName} labelText={labelText} reactHookFormProps={reactHookFormProps}>
      <div className='select is-fullwidth'>
        <select name={fieldName} ref={reactHookFormProps.register(validationOptions || {})}>
          {listItems.map((e, key) => {
            return <option key={key} value={e.value}>{e.name}</option>;
          })}
        </select>
      </div>
    </FormField>
  );
};

export default ListFormField;