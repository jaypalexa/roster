import DateFormField from '../FormFields/DateFormField';
import FormFieldRow from '../FormFields/FormFieldRow';
import LeaveThisPagePrompt from '../LeaveThisPagePrompt/LeaveThisPagePrompt';
import NumericTextFormField from '../FormFields/NumericTextFormField';
import OrganizationModel from '../../types/OrganizationModel';
import OrganizationService from '../../services/OrganizationService';
import RadioButtonFormField from '../FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from '../FormFields/RadioButtonGroupFormField';
import React, { useState } from 'react';
import TabHelper from '../../helpers/TabHelper';
import TextFormField from '../FormFields/TextFormField';
import useMount from 'hooks/UseMount';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppContext } from '../../contexts/AppContext';
import './Organization.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const Organization: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const methods = useForm<OrganizationModel>({ mode: 'onChange' });
  const { handleSubmit, formState, reset } = methods;
  const [currentOrganization, setCurrentOrganization] = useState({} as OrganizationModel);

  // console.log(JSON.stringify(formState));

  useMount(() => {
    window.scrollTo(0, 0)
  });

  useMount(() => {
    // make async server request
    const getOrganization = async () => {
      const organization = await OrganizationService.getOrganization(appContext.organizationId);
      reset(organization);
      setCurrentOrganization(organization);
    };
    getOrganization();
  });

  const onSubmit = handleSubmit((modifiedOrganization: OrganizationModel) => {
    const patchedOrganization = { ...currentOrganization, ...modifiedOrganization };
    OrganizationService.saveOrganization(patchedOrganization);
    reset(patchedOrganization);
    setCurrentOrganization(patchedOrganization);
    toast.success('Record saved');
  });

  const onCancel = () => {
    reset(currentOrganization);
  };

  new TabHelper().initialize();

  return (
    <div id='organization'>
      <LeaveThisPagePrompt isDirty={formState.dirty} />
      <nav className='breadcrumb shown-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li className='is-active'><a href='#' aria-current='page'>Organization</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>&#10094; Home</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered hidden-when-mobile'>Organization</h1>
          <FormContext {...methods} >
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
                  <FormFieldRow>
                    <TextFormField fieldName='organizationName' labelText='Organization Name' validationOptions={{ required: 'Organization Name is required' }} />
                    <TextFormField fieldName='permitNumber' labelText='Permit Number' />
                    <TextFormField fieldName='contactName' labelText='Contact Name' />
                  </FormFieldRow>

                  <FormFieldRow>
                    <TextFormField fieldName='address1' labelText='Address Line 1' />
                    <TextFormField fieldName='address2' labelText='Address Line 2' />
                  </FormFieldRow>

                  <FormFieldRow>
                    <TextFormField fieldName='city' labelText='City' />
                    <TextFormField fieldName='state' labelText='State' value='Florida' disabled={true} />
                    <TextFormField fieldName='zipCode' labelText='ZIP Code' maxLength={10} validationOptions={{ maxLength: { value: 10, message: 'ZIP Code cannot exceed 10 characters' } }} />
                  </FormFieldRow>

                  <FormFieldRow>
                    <TextFormField fieldName='phone' labelText='Phone' />
                    <TextFormField fieldName='fax' labelText='Fax' />
                    <TextFormField fieldName='emailAddress' labelText='Email Address'
                      validationOptions={{
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: 'Invalid email address'
                        }
                      }}
                    />
                  </FormFieldRow>
                </section>
                <section className='tab-content'> {/* Hatchling and Washback Starting Balances */}
                  <div className='columns is-centered'>
                    <div className='column is-half'>
                      <h2 className='is-size-5 has-text-centered'>Hatchlings</h2>
                      <DateFormField fieldName='hatchlingBalanceAsOfDate' labelText='Balance As Of' />
                      <NumericTextFormField fieldName='ccHatchlingStartingBalance' labelText='Loggerhead (Cc)' />
                      <NumericTextFormField fieldName='cmHatchlingStartingBalance' labelText='Green (Cm)' />
                      <NumericTextFormField fieldName='dcHatchlingStartingBalance' labelText='Leatherback (Dc)' />
                      <NumericTextFormField fieldName='otherHatchlingStartingBalance' labelText='Other' />
                      <NumericTextFormField fieldName='unKnownHatchlingStartingBalance' labelText='Unknown' />
                    </div>
                    <div className='column is-half'>
                      <h2 className='is-size-5 has-text-centered'>Washbacks</h2>
                      <DateFormField fieldName='washbackBalanceAsOfDate' labelText='Balance As Of' />
                      <NumericTextFormField fieldName='ccWashbackStartingBalance' labelText='Loggerhead (Cc)' />
                      <NumericTextFormField fieldName='cmWashbackStartingBalance' labelText='Green (Cm)' />
                      <NumericTextFormField fieldName='dcWashbackStartingBalance' labelText='Leatherback (Dc)' />
                      <NumericTextFormField fieldName='otherWashbackStartingBalance' labelText='Other' />
                      <NumericTextFormField fieldName='unKnownWashbackStartingBalance' labelText='Unknown' />
                    </div>
                  </div>
                </section>
                <section className='tab-content'> {/* Preferences */}
                  <RadioButtonGroupFormField fieldName='preferredUnitsType' labelText='Units Type' >
                    <RadioButtonFormField fieldName='preferredUnitsType' labelText='Metric' value='M' />
                    <RadioButtonFormField fieldName='preferredUnitsType' labelText='Imperial' value='I' />
                  </RadioButtonGroupFormField>
                </section>
              </div>

              <div className='field is-grouped form-action-buttons'>
                <p className='control'>
                  <input
                    type='submit'
                    className='button is-success is-fixed-width-medium'
                    value='Save'
                    disabled={!(formState.isValid && formState.dirty)}
                  />
                </p>
                <p className='control'>
                  <input
                    type='button'
                    className='button is-danger is-fixed-width-medium'
                    value='Cancel'
                    onClick={() => onCancel()}
                    disabled={!formState.dirty}
                  />
                </p>
              </div>

            </form>
          </FormContext>
        </div>
      </div>
    </div>
  );
};

export default Organization;
