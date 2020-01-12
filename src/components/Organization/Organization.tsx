import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import NavigationPrompt from "react-router-navigation-prompt";
import OrganizationService from '../../services/OrganizationService';
import StatesService from '../../services/StatesService';
import OrganizationModel from '../../types/OrganizationModel';
import './Organization.sass';

const Organization: React.FC = () => {

  const [currentOrganization, setCurrentOrganization] = useState({});
  const { errors, handleSubmit, formState, register, reset, watch } = useForm<OrganizationModel>();
  const states = StatesService.getStates();

  useEffect(() => {
    // make async server request
    const getOrganization = async () => {
      const fetchedOrganization = await OrganizationService.getOrganization();
      reset(fetchedOrganization);
      setCurrentOrganization(fetchedOrganization);
    };
    getOrganization();
  }, [reset]);

  console.log(JSON.stringify(formState));

  const onSubmit = handleSubmit((modifiedOrganization: OrganizationModel) => {
    console.log('in handleSubmit(): modifiedOrganization', modifiedOrganization);
    const patchedOrganization = {...currentOrganization, ...modifiedOrganization};
    console.log('in handleSubmit(): patchedOrganization', patchedOrganization);
    OrganizationService.saveOrganization(patchedOrganization);
    reset(patchedOrganization);
    setCurrentOrganization(patchedOrganization);
  });

  const onCancel = () => {
    console.log('in onCancel()...');
    reset(currentOrganization);
  };

  return (
    <div id='organization'>
      <NavigationPrompt when={formState.dirty}>
        {({ onConfirm, onCancel }) => (
          <ReactModal isOpen={true} ariaHideApp={false} className='loader-style'>
            <h3>You have unsaved changes, are you sure you want to leave?</h3>
            <button onClick={onConfirm}>Yes</button>
            <button onClick={onCancel}>No</button>
          </ReactModal>
        )}
      </NavigationPrompt>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Organization</h1>
          <form onSubmit={onSubmit}>

            <div className='field is-horizontal'>
              <div className='field-body'>
                <div className='field'>
                  <label className='label'>Organization Name</label>
                  <div className='control'>
                    <input name='organizationName'
                      className={`input ${!watch('organizationName') ? 'is-danger' : ''}`}
                      type='text'
                      placeholder='Organization Name'
                      ref={register({required: 'Organization Name is required'})}
                    />
                  </div>
                  <p className='help has-text-danger'>{errors.organizationName && errors.organizationName.message}</p>
                </div>
                <div className='field'>
                  <label className='label'>Permit Number</label>
                  <div className='control is-expanded'>
                    <input name='permitNumber' className='input' type='text' placeholder='Permit Number' ref={register} />
                  </div>
                </div>
                <div className='field'>
                  <label className='label'>Contact Name</label>
                  <div className='control is-expanded'>
                    <input name='contactName' className='input' type='text' placeholder='Contact Name' ref={register} />
                  </div>
                </div>
              </div>
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
                <div className='field'>
                  <label className='label'>Email Address</label>
                  <div className='control is-expanded'>
                    <input 
                      name='emailAddress' 
                      className='input' 
                      type='text' 
                      placeholder='Email Address' 
                      ref={register({ 
                        pattern: { 
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 
                          message: 'Invalid email address' 
                        }})}
                    />
                  </div>
                  <p className='help has-text-danger'>{errors.emailAddress && errors.emailAddress.message}</p>
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
