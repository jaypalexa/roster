import React from 'react';
import { Button, Form, Heading } from 'react-bulma-components';
import { useForm } from 'react-hook-form';
import browserHistory from '../../browserHistory';
import './Organization.sass';

interface jjj {
  example: string
}

const Organization: React.FC = () => {
  const { register, handleSubmit, watch, errors } = useForm()
  const onSubmit = (data: any) => { console.log(data) }

  console.log(watch('example')) // watch input value by passing the name of it

  return (
    <div id='organization' className='organization-component'>
      <Heading>Organization</Heading>
      <Button color='dark' onClick={() => browserHistory.push('/')}>Home</Button>
      <div>
        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <input name="example" defaultValue="test" ref={register} />
          <Form.Field>
            <Form.Label>Name</Form.Label>
            <Form.Control>
              {/* not working...try:  https://react-hook-form.com/api/#Controller */}
              <Form.Input name="example" defaultValue="test2" ref={register} />
            </Form.Control>
          </Form.Field>

          {/* include validation with required or other standard HTML validation rules */}
          <input name="exampleRequired" ref={register({ required: true })} />
          {/* errors will return when field validation fails  */}
          {errors.exampleRequired && <span>This field is required</span>}

          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Organization;
