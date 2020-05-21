import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import FormFieldGroup from 'components/FormFields/FormFieldGroup';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import ListFormField from 'components/FormFields/ListFormField';
import RadioButtonFormField from 'components/FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from 'components/FormFields/RadioButtonGroupFormField';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import NameValuePair from 'models/NameValuePair';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import SeaTurtleService from 'services/SeaTurtleService';
import { constants } from 'utils';
import { ReportOptionsFormFieldsProps } from './ReportOptionsFormFields';
import './ReportOptionsFormFields.sass';

const TaggingDataFormOptions: React.FC<ReportOptionsFormFieldsProps> = ({currentReportListItem, setShowSpinner}) => {
  const [appContext] = useAppContext();
  const { reset } = useFormContext();
  const [seaTurtleListItems, setSeaTurtleListItems] = useState([] as Array<NameValuePair>);

  useMount(() => {
    const fetchReportListItem = async () => {
      try {
        setShowSpinner(true);
        setSeaTurtleListItems(await SeaTurtleService.getSeaTurtleListItems());
        reset(appContext.reportOptions[currentReportListItem.reportId]);
      } 
      catch (err) {
        console.log(err);
        toast.error(constants.ERROR.GENERIC);
      }
      finally {
        setShowSpinner(false);
      }
    };
    fetchReportListItem();
  });

  return (
    <>
      <FormFieldRow>
        <ListFormField fieldName='seaTurtleId' labelText='Choose a turtle to generate the form for' listItems={seaTurtleListItems} />
      </FormFieldRow>
      <FormFieldRow>
        <FormFieldGroup fieldClass='checkbox-group checkboxes-3' labelText='Options'>
          <CheckboxFormField fieldName='populateFacilityField' labelText='Populate "Facility where turtle was being held" field' />
          <CheckboxFormField fieldName='additionalRemarksOrDataOnBackOfForm' labelText='Additional remarks or data on back of form' />
          <CheckboxFormField fieldName='printSidOnForm' labelText='Print SID on form' />
        </FormFieldGroup>
      </FormFieldRow>
      <FormFieldRow>
        <RadioButtonGroupFormField fieldName='useMorphometricsClosestTo' labelText='Use morphometrics closest to ' >
          <RadioButtonFormField fieldName='useMorphometricsClosestTo' labelText='Date acquired' value='dateAcquired' defaultChecked={true} />
          <br />
          <RadioButtonFormField fieldName='useMorphometricsClosestTo' labelText='Date relinquished' value='dateRelinquished' />
        </RadioButtonGroupFormField>
      </FormFieldRow>
    </>
  );
};

export default TaggingDataFormOptions;
