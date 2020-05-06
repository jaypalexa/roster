import DateFormField from 'components/FormFields/DateFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import IntegerFormField from 'components/FormFields/IntegerFormField';
import RadioButtonFormField from 'components/FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from 'components/FormFields/RadioButtonGroupFormField';
import TextFormField from 'components/FormFields/TextFormField';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import TabHelper from 'helpers/TabHelper';
import useMount from 'hooks/UseMount';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import RosterConstants from 'rosterConstants';
import OrganizationService from 'services/OrganizationService';
import OrganizationModel from 'types/OrganizationModel';
import './Organization.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const Organization: React.FC = () => {

  const methods = useForm<OrganizationModel>({ mode: 'onChange' });
  const { handleSubmit, formState, reset } = methods;
  const [currentOrganization, setCurrentOrganization] = useState({} as OrganizationModel);
  const [showSpinner, setShowSpinner] = useState(true);

  useMount(() => {
    window.scrollTo(0, 0)
  });

  useMount(() => {
    // TODO: CACHING ???
    // const organizationId = auth().getTokenOrganizationId;
    // const organization = ApiService.getCacheValue(`ORGANIZATION#${organizationId}`);
    // reset(organization);
    // setCurrentOrganization(organization);

    const fetchOrganization = async () => {
      try {
        const organization = await OrganizationService.getOrganization();
        reset(organization);
        setCurrentOrganization(organization);
      } 
      catch (err) {
        console.log(err);
        toast.error(RosterConstants.ERROR.GENERIC);
      }
      finally {
        setShowSpinner(false);
      }
    };
    fetchOrganization();
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
      <Spinner isActive={showSpinner} />
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
                      <DateFormField fieldName='hatchlingsBalanceAsOfDate' labelText='Balance As Of' />
                      <IntegerFormField fieldName='ccHatchlingsStartingBalance' labelText='Loggerhead (Cc)' />
                      <IntegerFormField fieldName='cmHatchlingsStartingBalance' labelText='Green (Cm)' />
                      <IntegerFormField fieldName='dcHatchlingsStartingBalance' labelText='Leatherback (Dc)' />
                      <IntegerFormField fieldName='otherHatchlingsStartingBalance' labelText='Other' />
                      <IntegerFormField fieldName='unknownHatchlingsStartingBalance' labelText='Unknown' />
                    </div>
                    <div className='column is-half'>
                      <h2 className='is-size-5 has-text-centered'>Washbacks</h2>
                      <DateFormField fieldName='washbacksBalanceAsOfDate' labelText='Balance As Of' />
                      <IntegerFormField fieldName='ccWashbacksStartingBalance' labelText='Loggerhead (Cc)' />
                      <IntegerFormField fieldName='cmWashbacksStartingBalance' labelText='Green (Cm)' />
                      <IntegerFormField fieldName='dcWashbacksStartingBalance' labelText='Leatherback (Dc)' />
                      <IntegerFormField fieldName='otherWashbacksStartingBalance' labelText='Other' />
                      <IntegerFormField fieldName='unknownWashbacksStartingBalance' labelText='Unknown' />
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
