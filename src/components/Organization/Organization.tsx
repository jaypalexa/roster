import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import OrganizationService from '../../services/OrganizationService';
import StatesService from '../../services/StatesService';
import OrganizationModel from '../../types/OrganizationModel';
import './Organization.sass';

const Organization: React.FC = () => {

  const [currentOrganization, setCurrentOrganization] = useState({});
  const { errors, handleSubmit, register, reset, watch } = useForm<OrganizationModel>();
  const states = StatesService.getStates();

  useEffect(() => {
    // you can do async server request and fill up form
    // setTimeout(() => {
    //   const fetchedOrganization = OrganizationService.getOrganization();
    //   reset(fetchedOrganization);
    //   setCurrentOrganization(fetchedOrganization);
    // }, 1000);
    const getOrganization = async () => {
      const fetchedOrganization = await OrganizationService.getOrganization();
      reset(fetchedOrganization);
      setCurrentOrganization(fetchedOrganization);
    };
    getOrganization();
  }, [reset]);

  const onSubmit = handleSubmit((modifiedOrganization: OrganizationModel) => {
    console.log('in handleSubmit(): modifiedOrganization', modifiedOrganization);
    const patchedOrganization = {...currentOrganization, ...modifiedOrganization};
    console.log('in handleSubmit(): patchedOrganization', patchedOrganization);
    OrganizationService.saveOrganization(patchedOrganization);
    setCurrentOrganization(patchedOrganization);
  });

  const onCancel = () => {
    console.log('in onCancel()...');
    reset(currentOrganization);
  };

  return (
    <div id='organization'>
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

            <div className='field is-horizontal'>
              <div className='field-body'>
                <div className='field'>
                  <label className='label'>Address</label>
                  <div className='control is-expanded'>
                    <input name='address1' className='input' type='text' placeholder='Address Line 1' ref={register} />
                  </div>
                </div>
                <div className='field'>
                  <label className='label'>&nbsp;</label>
                  <div className='control is-expanded'>
                    <input name='address2' className='input' type='text' placeholder='Address Line 2' ref={register} />
                  </div>
                </div>
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
                    <input name='phone' className='input' type='text' placeholder='Phone' ref={register} />
                  </div>
                </div>
                <div className='field'>
                  <label className='label'>Fax</label>
                  <div className='control is-expanded'>
                    <input name='fax' className='input' type='text' placeholder='Fax' ref={register} />
                  </div>
                </div>
              </div>
            </div>

            <div className='field'>
              <label className='label'>Units Type</label>
              <div className='control'>
                <label className='radio'>
                  <input type='radio' name='preferredUnitsType' value='M' ref={register}/>
                  Metric
                </label>
                <label className='radio'>
                  <input type='radio' name='preferredUnitsType' value='I' ref={register}/>
                  Imperial
                </label>
              </div>
            </div>

            <div className='field is-grouped is-grouped-right'>
              <p className='control'>
                <input 
                  type='button' 
                  className='button is-danger is-fixed-width-medium' 
                  value='Cancel'
                  onClick={() => onCancel()}
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
