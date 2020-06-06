import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import CheckboxGroupFormField from 'components/FormFields/CheckboxGroupFormField';
import FormFieldRowMui from 'components/FormFields/FormFieldRow';
import ListFormField from 'components/FormFields/ListFormField';
import RadioButtonFormField from 'components/FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from 'components/FormFields/RadioButtonGroupFormField';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import NameValuePair from 'models/NameValuePair';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import SeaTurtleService from 'services/SeaTurtleService';
import ToastService from 'services/ToastService';
import { constants } from 'utils';
import { ReportOptionsFormFieldsProps } from './ReportOptionsFormFields';
import './ReportOptionsFormFields.sass';

const TaggingDataFormOptions: React.FC<ReportOptionsFormFieldsProps> = ({reportDefinition, setShowSpinner}) => {
  const [appContext] = useAppContext();
  const { reset } = useFormContext();
  const [seaTurtleListItems, setSeaTurtleListItems] = useState([] as Array<NameValuePair>);

  useMount(() => {
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
  });

  return (
    <>
      <FormFieldRowMui>
        <ListFormField fieldName='seaTurtleId' labelText='Choose a turtle to generate the form for' listItems={seaTurtleListItems} />
      </FormFieldRowMui>
      <FormFieldRowMui>
        <CheckboxGroupFormField labelText='Options'>
          <CheckboxFormField fieldName='populateFacilityField' labelText='Populate "Facility where turtle was being held" field' />
          <CheckboxFormField fieldName='additionalRemarksOrDataOnBackOfForm' labelText='Additional remarks or data on back of form' />
          <CheckboxFormField fieldName='printSidOnForm' labelText='Print SID on form' />
        </CheckboxGroupFormField>
      </FormFieldRowMui>
      <FormFieldRowMui>
        <RadioButtonGroupFormField fieldName='useMorphometricsClosestTo' labelText='Use morphometrics closest to' >
          <RadioButtonFormField labelText='Date acquired' value='dateAcquired' />
          <RadioButtonFormField labelText='Date relinquished' value='dateRelinquished' />
        </RadioButtonGroupFormField>
      </FormFieldRowMui>
    </>
  );
};

export default TaggingDataFormOptions;
