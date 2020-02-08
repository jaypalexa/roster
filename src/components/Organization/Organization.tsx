import ReactHookFormProps from 'components/FormFields/ReactHookFormProps';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAppContext } from '../../contexts/AppContext';
import TabHelper from '../../helpers/TabHelper';
import CodeListTableService, { CodeTableType } from '../../services/CodeTableListService';
import OrganizationService from '../../services/OrganizationService';
import NameValuePair from '../../types/NameValuePair';
import OrganizationModel from '../../types/OrganizationModel';
import DateFormField from '../FormFields/DateFormField';
import FormFieldRow from '../FormFields/FormFieldRow';
import ListFormField from '../FormFields/ListFormField';
import NumericTextFormField from '../FormFields/NumericTextFormField';
import RadioButtonFormField from '../FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from '../FormFields/RadioButtonGroupFormField';
import TextFormField from '../FormFields/TextFormField';
import UnsavedChanges from '../UnsavedChanges/UnsavedChanges';
import './Organization.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const Organization: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const [currentOrganization, setCurrentOrganization] = useState({} as OrganizationModel);
  const [states, setStates] = useState([] as Array<NameValuePair>);
  const { errors, handleSubmit, formState, register, reset, watch } = useForm<OrganizationModel>({ mode: 'onChange' });
  const reactHookFormProps: ReactHookFormProps = { errors, register, watch };

  useEffect(() => {
    setStates(CodeListTableService.getList(CodeTableType.States, true));
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
    const patchedOrganization = { ...currentOrganization, ...modifiedOrganization };
    // console.log('in handleSubmit(): patchedOrganization', patchedOrganization);
    OrganizationService.saveOrganization(patchedOrganization);
    reset(patchedOrganization);
    setCurrentOrganization(patchedOrganization);
    toast.success('Record saved');
  });

  const onCancel = () => {
    // console.log('in onCancel()...');
    // console.log('currentOrganization', currentOrganization);
    reset(currentOrganization);
  };

  new TabHelper().initialize();

  return (
    <div id='organization'>
      <UnsavedChanges isDirty={formState.dirty}></UnsavedChanges>
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
                <FormFieldRow>
                  <TextFormField fieldName='organizationName' labelText='Organization Name' reactHookFormProps={reactHookFormProps} validationOptions={{required: 'Organization Name is required'}} />
                  <TextFormField fieldName='permitNumber' labelText='Permit Number' reactHookFormProps={reactHookFormProps} />
                  <TextFormField fieldName='contactName' labelText='Contact Name' reactHookFormProps={reactHookFormProps} />
                </FormFieldRow>

                <FormFieldRow>
                  <TextFormField fieldName='address1' labelText='Address Line 1' reactHookFormProps={reactHookFormProps} />
                  <TextFormField fieldName='address2' labelText='Address Line 2' reactHookFormProps={reactHookFormProps} />
                </FormFieldRow>

                <FormFieldRow>
                  <TextFormField fieldName='city' labelText='City' reactHookFormProps={reactHookFormProps} />
                  <ListFormField fieldName='state' labelText='State' listItems={states} reactHookFormProps={reactHookFormProps} />
                  <TextFormField fieldName='zipCode' labelText='ZIP Code' maxLength={10} reactHookFormProps={reactHookFormProps} validationOptions={{ maxLength: { value: 10, message: 'ZIP Code cannot exceed 10 characters' } }} />
                </FormFieldRow>

                <FormFieldRow>
                  <TextFormField fieldName='phone' labelText='Phone' reactHookFormProps={reactHookFormProps} />
                  <TextFormField fieldName='fax' labelText='Fax' reactHookFormProps={reactHookFormProps} />
                  <TextFormField fieldName='emailAddress' labelText='Email Address' reactHookFormProps={reactHookFormProps}
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
                    <DateFormField fieldName='hatchlingBalanceAsOfDate' labelText='Balance As Of' reactHookFormProps={reactHookFormProps} />
                    <NumericTextFormField fieldName='ccHatchlingStartingBalance' labelText='Loggerhead (Cc)' reactHookFormProps={reactHookFormProps} />
                    <NumericTextFormField fieldName='cmHatchlingStartingBalance' labelText='Green (Cm)' reactHookFormProps={reactHookFormProps} />
                    <NumericTextFormField fieldName='dcHatchlingStartingBalance' labelText='Leatherback (Dc)' reactHookFormProps={reactHookFormProps} />
                    <NumericTextFormField fieldName='otherHatchlingStartingBalance' labelText='Other' reactHookFormProps={reactHookFormProps} />
                    <NumericTextFormField fieldName='unKnownHatchlingStartingBalance' labelText='Unknown' reactHookFormProps={reactHookFormProps} />
                  </div>
                  <div className='column is-half'>
                    <h2 className='is-size-5 has-text-centered'>Washbacks</h2>
                    <DateFormField fieldName='washbackBalanceAsOfDate' labelText='Balance As Of' reactHookFormProps={reactHookFormProps} />
                    <NumericTextFormField fieldName='ccWashbackStartingBalance' labelText='Loggerhead (Cc)' reactHookFormProps={reactHookFormProps} />
                    <NumericTextFormField fieldName='cmWashbackStartingBalance' labelText='Green (Cm)' reactHookFormProps={reactHookFormProps} />
                    <NumericTextFormField fieldName='dcWashbackStartingBalance' labelText='Leatherback (Dc)' reactHookFormProps={reactHookFormProps} />
                    <NumericTextFormField fieldName='otherWashbackStartingBalance' labelText='Other' reactHookFormProps={reactHookFormProps} />
                    <NumericTextFormField fieldName='unKnownWashbackStartingBalance' labelText='Unknown' reactHookFormProps={reactHookFormProps} />
                  </div>
                </div>
              </section>

              <section className='tab-content'> {/* Preferences */}
                <RadioButtonGroupFormField fieldName='preferredUnitsType' labelText='Units Type' reactHookFormProps={reactHookFormProps} >
                  <RadioButtonFormField fieldName='preferredUnitsType' labelText='Metric' value='M' reactHookFormProps={reactHookFormProps} />
                  <RadioButtonFormField fieldName='preferredUnitsType' labelText='Imperial' value='I' reactHookFormProps={reactHookFormProps} />
                </RadioButtonGroupFormField>
              </section>
            </div>

            <div className='field is-grouped action-button-grouping'>
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
                  className='button is-success is-fixed-width-medium'
                  value='Save'
                  disabled={!formState.dirty || !formState.isValid}
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
