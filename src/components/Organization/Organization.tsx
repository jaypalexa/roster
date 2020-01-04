import * as yup from 'yup';
import React from 'react';
import { Heading } from 'react-bulma-components';
import { useForm } from 'react-hook-form';
import './Organization.sass';
// import browserHistory from '../../browserHistory';

const Organization: React.FC = () => {

  type FormData = {
    stringField: string;
    numberField: string;
    dateField: Date;
  };

  const validationSchema = yup.object().shape({
    stringField: yup.string().required('required field'),
    numberField: yup
      .number()
      .min(1, 'number must be greater than 0')
      .max(10, 'number must be lower than 10')
      .typeError('you must specify a number')
      .required('required field'),
    dateField: yup
      .date()
      .typeError('invalid date')
      .min(new Date('2019-12-01'), 'must be greater than 01/12/2019')
      .max(new Date('2019-12-31'), 'Debe ser menor al 31/12/2019')
      .required('required field')
  });

  const defaultValues: FormData = {
    stringField: '',
    numberField: '0',
    dateField: new Date()
  };

  const methods = useForm<FormData>({
    validationSchema: validationSchema,
    defaultValues: defaultValues
  });

  const { register, handleSubmit, errors } = methods;

  const onSubmit = handleSubmit((values: FormData) => {
    const { stringField, numberField, dateField } = values;
    console.log('stringField: ' + stringField);
    console.log('numberField: ' + numberField);
    console.log('dateField: ' + dateField);
  });

  console.log(errors.dateField);

  return (
    <div id='organization' className='has-text-centered'>
      <Heading>Organization</Heading>
      {/* <Button color='dark' onClick={() => browserHistory.push('/')}>Home</Button> */}
      <form onSubmit={onSubmit}>
        <label>String Field</label>
        <input name='stringField' ref={register} />
        <label style={{ color: 'red' }}>
          {errors.stringField && errors.stringField.message}
        </label>

        <label>Number Field</label>
        <input name='numberField' type='number' ref={register} />
        <label style={{ color: 'red' }}>
          {errors.numberField && errors.numberField.message}
        </label>

        <label>Date Field</label>
        <input name='dateField' type='date' ref={register} />
        <label style={{ color: 'red' }}>
          {errors.dateField && errors.dateField.message}
        </label>

        <input type='submit' />
      </form>
    </div>
  );
};

export default Organization;
