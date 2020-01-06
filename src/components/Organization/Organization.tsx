import React from 'react';
import { useForm } from 'react-hook-form';
import './Organization.sass';

const Organization: React.FC = () => {

  const states = [
    { value: '', name: '' },
    { value: 'AK', name: 'AK' },
    { value: 'AL', name: 'AL' },
    { value: 'AR', name: 'AR' },
    { value: 'AZ', name: 'AZ' },
    { value: 'CA', name: 'CA' },
    { value: 'CO', name: 'CO' },
    { value: 'CT', name: 'CT' },
    { value: 'DC', name: 'DC' },
    { value: 'DE', name: 'DE' },
    { value: 'FL', name: 'FL' },
    { value: 'GA', name: 'GA' },
    { value: 'HI', name: 'HI' },
    { value: 'IA', name: 'IA' },
    { value: 'ID', name: 'ID' },
    { value: 'IL', name: 'IL' },
    { value: 'IN', name: 'IN' },
    { value: 'KS', name: 'KS' },
    { value: 'KY', name: 'KY' },
    { value: 'LA', name: 'LA' },
    { value: 'MA', name: 'MA' },
    { value: 'MD', name: 'MD' },
    { value: 'ME', name: 'ME' },
    { value: 'MI', name: 'MI' },
    { value: 'MN', name: 'MN' },
    { value: 'MO', name: 'MO' },
    { value: 'MS', name: 'MS' },
    { value: 'MT', name: 'MT' },
    { value: 'NC', name: 'NC' },
    { value: 'ND', name: 'ND' },
    { value: 'NE', name: 'NE' },
    { value: 'NH', name: 'NH' },
    { value: 'NJ', name: 'NJ' },
    { value: 'NM', name: 'NM' },
    { value: 'NV', name: 'NV' },
    { value: 'NY', name: 'NY' },
    { value: 'OH', name: 'OH' },
    { value: 'OK', name: 'OK' },
    { value: 'OR', name: 'OR' },
    { value: 'PA', name: 'PA' },
    { value: 'RI', name: 'RI' },
    { value: 'SC', name: 'SC' },
    { value: 'SD', name: 'SD' },
    { value: 'TN', name: 'TN' },
    { value: 'TX', name: 'TX' },
    { value: 'UT', name: 'UT' },
    { value: 'VA', name: 'VA' },
    { value: 'VT', name: 'VT' },
    { value: 'WA', name: 'WA' },
    { value: 'WI', name: 'WI' },
    { value: 'WV', name: 'WV' },
    { value: 'WY', name: 'WY' }         
  ];

  type FormData = {
    organizationName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
  };

  // const defaultValues: FormData = {
  //   organizationName: '',
  //   addressLine1: '',
  //   addressLine2: ''
  // };

  let defaultValues = JSON.parse(localStorage.getItem('organization') || '{}');

  const methods = useForm<FormData>({
    defaultValues: defaultValues
  });

  const { errors, handleSubmit, register, reset, watch } = methods;

  const onSubmit = handleSubmit((values: FormData) => {
    console.log('in handleSubmit(): values', values);
    localStorage.setItem('organization', JSON.stringify(values));
    defaultValues = {...values};
  });

  const handleCancel = (): void => {
    console.log('in handleCancel()...');
    reset({ ...defaultValues });
  };

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
              <label className='label'>Address / City / State / ZIP Code</label>
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
                    <input name='city' className='input' type='text' placeholder='City' ref={register} />
                  </div>
                </div>
                <div className='field'>
                  <div className='control is-expanded'>
                    <div className='select is-fullwidth'>
                      <select name='state' ref={register}>
                          {states.map((e, key) => {
                              return <option key={key} value={e.value}>{e.name}</option>;
                          })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className='field'>
                  <div className='control is-expanded'>
                    <input 
                      name='zipCode' 
                      className='input' 
                      type='text' 
                      placeholder='ZIP Code' 
                      maxLength={10}
                      ref={register({maxLength: {value: 10, message:'ZIP Code cannot exceed 10 characters'}})} 
                    />
                  </div>
                  <p className='help has-text-danger'>{errors.zipCode && errors.zipCode.message}</p>
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
                <input 
                  type='button' 
                  className='button is-danger is-fixed-width-medium' 
                  value='Cancel'
                  onClick={() => handleCancel()}
                />
              </p>

              <p className='control'>
                <input type='submit' className='button is-success is-fixed-width-medium' value='Save' />
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Organization;
