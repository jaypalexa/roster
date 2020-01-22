/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import NavigationPrompt from 'react-router-navigation-prompt';
import { toast } from 'react-toastify';
import { useAppContext } from '../../contexts/AppContext';
import OrganizationService from '../../services/OrganizationService';
import StatesService from '../../services/StatesService';
import OrganizationModel from '../../types/OrganizationModel';
import './Organization.sass';

const Organization: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const [currentOrganization, setCurrentOrganization] = useState({} as OrganizationModel);
  const { errors, handleSubmit, formState, register, reset, watch } = useForm<OrganizationModel>();
  const states = StatesService.getStates();

  useEffect(() => {
    // make async server request
    const getOrganization = async () => {
      const fetchedOrganization = await OrganizationService.getOrganization(appContext.organizationId);
      reset(fetchedOrganization);
      setCurrentOrganization(fetchedOrganization);
    };
    getOrganization();
  }, [reset, appContext.organizationId]);

  // console.log(JSON.stringify(formState));

  const onSubmit = handleSubmit((modifiedOrganization: OrganizationModel) => {
    // console.log('in handleSubmit(): modifiedOrganization', modifiedOrganization);
    const patchedOrganization = {...currentOrganization, ...modifiedOrganization};
    // console.log('in handleSubmit(): patchedOrganization', patchedOrganization);
    OrganizationService.saveOrganization(patchedOrganization);
    reset(patchedOrganization);
    setCurrentOrganization(patchedOrganization);
    toast.success('Record saved');
  });

  const onCancel = () => {
    console.log('in onCancel()...');
    console.log('currentOrganization', currentOrganization);
    reset(currentOrganization);
  };

  let tabs = document.querySelectorAll('.tabs li');
  let tabsContent = document.querySelectorAll('.tab-content');

  let deactvateAllTabs = function () {
    tabs.forEach(function (tab) {
      tab.classList.remove('is-active');
    });
  };

  let hideTabsContent = function () {
    tabsContent.forEach(function (tabContent) {
      tabContent.classList.remove('is-active');
    });
  };

  let activateTabsContent = function (tab: Element) {
    tabsContent[getIndex(tab)].classList.add('is-active');
  };

  let getIndex = function (el: Element) {
    const nodes = Array.prototype.slice.call(el?.parentElement?.children);
    return nodes.indexOf(el);
  };

  tabs.forEach(function (tab: Element) {
    tab.addEventListener('click', function () {
      deactvateAllTabs();
      hideTabsContent();
      tab.classList.add('is-active');
      activateTabsContent(tab);
    });
  })

  return (
    <div id='organization'>
      <NavigationPrompt when={formState.dirty}>
        {({ onConfirm, onCancel }) => (
          <div className='modal is-active'>
            <div className='modal-background'></div>
            <div className='modal-card'>
              <header className='modal-card-head'>
                <p className='modal-card-title'>Unsaved Changes</p>
              </header>
              <section className='modal-card-body'>
                <p>You have unsaved changes. Are you sure you want to leave?</p>
              </section>
              <footer className='modal-card-foot'>
                <button className='button is-success' onClick={onConfirm}>Yes</button>
                <button className='button is-danger' onClick={onCancel}>No</button>
              </footer>
            </div>
          </div>
        )}
      </NavigationPrompt>

      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Organization</h1>
          <form onSubmit={onSubmit}>

            <div className='tabs'>
              <ul>
                <li className='is-active'><a>General Information</a></li>
                <li><a>Hatchling and Washback Starting Balances</a></li>
                <li><a>Preferences</a></li>
              </ul>
            </div>

            <div>
              <section className='tab-content is-active'> {/* General Information */}
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
                        <input name='permitNumber' className='input' type='text' placeholder='Permit Number' ref={register({required: false})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Contact Name</label>
                      <div className='control is-expanded'>
                        <input name='contactName' className='input' type='text' placeholder='Contact Name' ref={register({required: false})} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='field is-horizontal'>
                  <div className='field-body'>
                    <div className='field'>
                      <label className='label'>Address</label>
                      <div className='control is-expanded'>
                        <input name='address1' className='input' type='text' placeholder='Address Line 1' ref={register({required: false})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>&nbsp;</label>
                      <div className='control is-expanded'>
                        <input name='address2' className='input' type='text' placeholder='Address Line 2' ref={register({required: false})} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='field is-horizontal'>
                  <div className='field-body'>
                    <div className='field'>
                      <div className='control is-expanded'>
                        <input name='city' className='input' type='text' placeholder='City' ref={register({required: false})} />
                      </div>
                    </div>
                    <div className='field'>
                      <div className='control is-expanded'>
                        <div className='select is-fullwidth'>
                          <select name='state' ref={register({required: false})}>
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
                        <input name='phone' className='input' type='text' placeholder='Phone' ref={register({required: false})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Fax</label>
                      <div className='control is-expanded'>
                        <input name='fax' className='input' type='text' placeholder='Fax' ref={register({required: false})} />
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
              </section>

              <section className='tab-content'> {/* Hatchling and Washback Starting Balances */}
                <div className='columns is-centered'>
                  <div className='column is-half'>
                    <h2 className='is-size-5 has-text-centered'>Hatchlings</h2>
                    <div className='field'>
                      <label className='label'>Balance As Of</label>
                      <div className='control is-expanded'>
                        <input name='hatchlingBalanceAsOfDate' className='input' type='date' ref={register({required: false})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Loggerhead (Cc)</label>
                      <div className='control is-expanded'>
                        <input name='ccHatchlingStartingBalance' className='input' type='number' min='0' pattern='\d+' ref={register({required: false})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Green (Cm)</label>
                      <div className='control is-expanded'>
                        <input name='cmHatchlingStartingBalance' className='input' type='number' min='0' pattern='\d+' ref={register({required: false})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Leatherback (Dc)</label>
                      <div className='control is-expanded'>
                        <input name='dcHatchlingStartingBalance' className='input' type='number' min='0' pattern='\d+' ref={register({required: false})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Other</label>
                      <div className='control is-expanded'>
                        <input name='otherHatchlingStartingBalance' className='input' type='number' min='0' pattern='\d+' ref={register({required: false})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Unknown</label>
                      <div className='control is-expanded'>
                        <input name='unKnownHatchlingStartingBalance' className='input' type='number' min='0' pattern='\d+' ref={register({required: false})} />
                      </div>
                    </div>
                  </div>
                  <div className='column is-half'>
                    <h2 className='is-size-5 has-text-centered'>Washbacks</h2>
                    <div className='field'>
                      <label className='label'>Balance As Of</label>
                      <div className='control is-expanded'>
                        <input name='washbackBalanceAsOfDate' className='input' type='date' ref={register({required: false})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Loggerhead (Cc)</label>
                      <div className='control is-expanded'>
                        <input name='ccWashbackStartingBalance' className='input' type='number' min='0' pattern='\d+' ref={register({required: false})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Green (Cm)</label>
                      <div className='control is-expanded'>
                        <input name='cmWashbackStartingBalance' className='input' type='number' min='0' pattern='\d+' ref={register({required: false})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Leatherback (Dc)</label>
                      <div className='control is-expanded'>
                        <input name='dcWashbackStartingBalance' className='input' type='number' min='0' pattern='\d+' ref={register({required: false})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Other</label>
                      <div className='control is-expanded'>
                        <input name='otherWashbackStartingBalance' className='input' type='number' min='0' pattern='\d+' ref={register({required: false})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Unknown</label>
                      <div className='control is-expanded'>
                        <input name='unKnownWashbackStartingBalance' className='input' type='number' min='0' pattern='\d+' ref={register({required: false})} />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className='tab-content'> {/* Preferences */}
                <div className='field'>
                  <label className='label'>Units Type</label>
                  <div className='control'>
                    <label className='radio'>
                      <input type='radio' name='preferredUnitsType' value='M' ref={register({required: false})}/>
                      Metric
                    </label>
                    <label className='radio'>
                      <input type='radio' name='preferredUnitsType' value='I' ref={register({required: false})}/>
                      Imperial
                    </label>
                  </div>
                </div>
              </section>
            </div>

            <div className='field is-grouped is-grouped-right'>
              <p className='control'>
                <input 
                  type='button' 
                  className='button is-danger is-fixed-width-medium' 
                  value='Cancel'
                  onClick={() => onCancel()}
                  disabled={!formState.dirty}
                />
              </p>

              <p className='control'>
                <input 
                  type='submit' 
                  className='button is-success is-fixed-width-medium has-background-success' 
                  value='Save'
                  disabled={!formState.dirty}
                />
              </p>
            </div>
            
          </form>

        </div>
      </div>
    </div>
  );
};

export default Organization;
