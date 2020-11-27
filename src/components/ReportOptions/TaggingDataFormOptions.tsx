import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import CheckboxGroupFormField from 'components/FormFields/CheckboxGroupFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import ListFormField from 'components/FormFields/ListFormField';
import RadioButtonFormField from 'components/FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from 'components/FormFields/RadioButtonGroupFormField';
import { useAppContext } from 'contexts/AppContext';
import NameValuePair from 'models/NameValuePair';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import SeaTurtleService from 'services/SeaTurtleService';
import ToastService from 'services/ToastService';
import { constants } from 'utils';
import { ReportOptionsFormFieldsProps } from './ReportOptionsFormFields';

const TaggingDataFormOptions: React.FC<ReportOptionsFormFieldsProps> = ({reportDefinition, setShowSpinner}) => {
  const [appContext] = useAppContext();
  const { reset } = useFormContext();
  const [seaTurtleListItems, setSeaTurtleListItems] = useState([] as Array<NameValuePair>);

  useEffect(() => {
    const fetchReportDefinition = async () => {
      try {
        setShowSpinner(true);
        setSeaTurtleListItems(await SeaTurtleService.getSeaTurtleListItems());
        reset(appContext.reportOptions[reportDefinition.reportId]);
      } 
      catch (err) {
        console.log(err);
        ToastService.error(constants.ERROR.GENERIC);
      }
      finally {
        setShowSpinner(false);
      }
    };
    fetchReportDefinition();
  }, [reset, appContext.reportOptions, reportDefinition.reportId, setShowSpinner]);

  return (
    <>
      <FormFieldRow>
        <ListFormField fieldName='seaTurtleId' labelText='Choose a turtle to generate the form for' listItems={seaTurtleListItems} />
      </FormFieldRow>
      <FormFieldRow>
        <CheckboxGroupFormField labelText='Options'>
          <CheckboxFormField fieldName='populateFacilityField' labelText='Populate "Facility where turtle was being held" field' />
          <CheckboxFormField fieldName='additionalRemarksOrDataOnBackOfForm' labelText='Additional remarks or data on back of form' />
          <CheckboxFormField fieldName='printSidOnForm' labelText='Print SID on form' />
        </CheckboxGroupFormField>
      </FormFieldRow>
      <FormFieldRow>
        <RadioButtonGroupFormField fieldName='useMorphometricsClosestTo' labelText='Use morphometrics closest to' >
          <RadioButtonFormField labelText='Date acquired' value='dateAcquired' />
          <RadioButtonFormField labelText='Date relinquished' value='dateRelinquished' />
        </RadioButtonGroupFormField>
      </FormFieldRow>
    </>
  );
};

export default TaggingDataFormOptions;
