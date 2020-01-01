import browserHistory from '../../browserHistory';
import React from 'react';
import { Button, Columns, Form, Heading } from 'react-bulma-components';
import { Controller, ErrorMessage, useForm } from 'react-hook-form';
import './Organization.sass';

interface jjj {
  example: string
}

const Organization: React.FC = () => {
  const { control, register, handleSubmit, watch, errors, reset } = useForm()
  const onSubmit = (data: any) => { console.log(data) }

  console.log(watch('organizationName')) // watch input value by passing the name of it

  return (
    <div id='organization' className='has-text-centered'>
      <Heading>Organization</Heading>
      {/* <Button color='dark' onClick={() => browserHistory.push('/')}>Home</Button> */}
      <Columns>
        <Columns.Column className='has-text-left is-half'>
          {/* 'handleSubmit' will validate your inputs before invoking 'onSubmit' */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the 'register' function */}
            {/* <input name='example' defaultValue='test' ref={register} /> */}
            <Form.Field>
              <Form.Label>Organization Name</Form.Label>
              <Form.Control>
                <Controller as={<Form.Input />} name='organizationName' control={control} rules={{ required: true }} />
                {/* include validation with required or other standard HTML validation rules */}
                {/* <input name='exampleRequired' ref={register({ required: true })} /> */}
                {/* errors will return when field validation fails  */}
                {errors.organizationNameRequired && <span>This field is required</span>}
                <ErrorMessage errors={errors} name='organizationName' />
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label>Address</Form.Label>
              <Form.Control>
                <Controller as={<Form.Input />} name='addressLine1' control={control} />
              </Form.Control>
            </Form.Field>
            <input type='submit' />
            <input
              style={{ display: 'block', marginTop: 20 }}
              type="reset"
              onClick={reset}
              value="Custom Reset Field Values & Errors"
            />
            {/* <Button color='success'>Save</Button> */}
            {/* <Button color='danger' onClick={() => reset()}>Clear</Button> */}
            {/* <Button.Group>
              <Button color='success' submit>Save</Button>
              <Button color='danger' onClick={reset}>Clear</Button>
            </Button.Group> */}

          </form>
        </Columns.Column>
      </Columns>
    </div>
  );
};

export default Organization;
