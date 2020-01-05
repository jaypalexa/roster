import React from 'react';
import { useForm } from 'react-hook-form';
import './Organization.sass';

const Organization: React.FC = () => {

  type FormData = {
    organizationName: string;
    addressLine1: string;
    addressLine2: string;
  };

  const defaultValues: FormData = {
    organizationName: '',
    addressLine1: '',
    addressLine2: ''
  };

  const methods = useForm<FormData>({
    defaultValues: defaultValues
  });

  const { register, handleSubmit, errors, watch } = methods;

  const onSubmit = handleSubmit((values: FormData) => {
    console.log('values', values);
  });

  return (
    <div id='organization' className='container'>
      <div className='columns'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Organization</h1>
          <form onSubmit={onSubmit}>

            <div className='field'>
              <label className='label'>Organization Name</label>
              <div className='control'>
                <input name='organizationName'
                  className={`input ${!watch('organizationName') ? 'is-danger' : ''}`}
                  type='text'
                  placeholder='Organization Name'
                  ref={register({ required: 'Organization Name is required' })}
                />
              </div>
              <p className='help has-text-danger'>{errors.organizationName && errors.organizationName.message}</p>
            </div>

            <div className='field'>
              <label className='label'>Address</label>
              <div className='control'>
                <input name='addressLine1' className='input' type='text' placeholder='Address Line 1' ref={register} />
              </div>
            </div>

            <div className='field'>
              <div className='control'>
                <input name='addressLine2' className='input' type='text' placeholder='Address Line 2' ref={register} />
              </div>
            </div>

            <div className='field is-horizontal'>
              <div className='field-body'>
                <div className='field'>
                  <div className='control is-expanded'>
                    <input name='city' className='input' type='text' placeholder='City' />
                  </div>
                </div>
                <div className='field'>
                  <div className='control is-expanded'>
                    <input name='state' className='input' type='text' placeholder='State' />
                  </div>
                </div>
                <div className='field'>
                  <div className='control is-expanded'>
                    <input name='zipCode' className='input' type='text' placeholder='ZIP Code' />
                  </div>
                </div>
              </div>
            </div>

            <div className='field is-horizontal'>
              <div className='field-body'>
                <div className='field'>
                  <label className='label'>Phone</label>
                  <div className='control is-expanded'>
                    <input name='phone' className='input' type='text' placeholder='Phone' />
                  </div>
                </div>
                <div className='field'>
                  <label className='label'>Fax</label>
                  <div className='control is-expanded'>
                    <input name='fax' className='input' type='text' placeholder='Fax' />
                  </div>
                </div>
              </div>
            </div>

            <div className='field is-grouped is-grouped-right'>
              <p className='control'>
                <input type='submit' className='button is-success is-fixed-width-medium' value='Save' />
              </p>
              <p className='control'>
                <button className='button is-danger is-fixed-width-medium'>
                  Cancel
                </button>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Organization;
