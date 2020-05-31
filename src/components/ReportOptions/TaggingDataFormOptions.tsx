import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import FormFieldGroup from 'components/FormFields/FormFieldGroup';
import FormFieldRowMui from 'components/FormFields/FormFieldRowMui';
import ListFormFieldMui from 'components/FormFields/ListFormFieldMui';
import RadioButtonFormFieldMui from 'components/FormFields/RadioButtonFormFieldMui';
import RadioButtonGroupFormFieldMui from 'components/FormFields/RadioButtonGroupFormFieldMui';
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
        toast.error(constants.ERROR.GENERIC);
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
        <ListFormFieldMui fieldName='seaTurtleId' labelText='Choose a turtle to generate the form for' listItems={seaTurtleListItems} />
      </FormFieldRowMui>
      <FormFieldRowMui>
        <FormFieldGroup fieldClass='checkbox-group' labelText='Options'>
          <CheckboxFormField fieldName='populateFacilityField' labelText='Populate "Facility where turtle was being held" field' />
          <CheckboxFormField fieldName='additionalRemarksOrDataOnBackOfForm' labelText='Additional remarks or data on back of form' />
          <CheckboxFormField fieldName='printSidOnForm' labelText='Print SID on form' />
        </FormFieldGroup>
      </FormFieldRowMui>
      <FormFieldRowMui>
        <RadioButtonGroupFormFieldMui fieldName='useMorphometricsClosestTo' labelText='Use morphometrics closest to' >
          <RadioButtonFormFieldMui labelText='Date acquired' value='dateAcquired' />
          <RadioButtonFormFieldMui labelText='Date relinquished' value='dateRelinquished' />
        </RadioButtonGroupFormFieldMui>
      </FormFieldRowMui>
    </>
  );
};

export default TaggingDataFormOptions;
