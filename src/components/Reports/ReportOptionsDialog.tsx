import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import DateFormField from 'components/FormFields/DateFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import ListFormField from 'components/FormFields/ListFormField';
import RadioButtonFormField from 'components/FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from 'components/FormFields/RadioButtonGroupFormField';
import TextareaFormField from 'components/FormFields/TextareaFormField';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import React, { useEffect, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Modal from 'react-modal';
import SeaTurtleService from 'services/SeaTurtleService';
import NameValuePair from 'types/NameValuePair';
import ReportListItemModel from 'types/ReportListItemModel';

interface ReportOptionsDialogProps {
  isActive: boolean,
  reportListItem: ReportListItemModel,
  onGenerate: (reportListItem: ReportListItemModel, reportOptions: any) => void,
  onCancel: () => void,
}

const ReportOptionsDialog: React.FC<ReportOptionsDialogProps> = ({isActive, reportListItem, onGenerate, onCancel}) => {

  const methods = useForm<any>({ mode: 'onChange' });
  const { handleSubmit, reset } = methods;
  
  const [seaTurtleListItems, setSeaTurtleListItems] = useState([] as Array<NameValuePair>);
  const [showSpinner, setShowSpinner] = useState(false);

  const convertDateToYyyyMmDdString = (dateValue: Date) => {
    return new Date(dateValue.getTime() - (dateValue.getTimezoneOffset() * 60000 )).toISOString().split('T')[0];
  }

  useEffect(() => {
    if (reportListItem.reportId === 'TaggingDataForm') {
      const fetchSeaTurtleListItems = async () => {
        try {
          setShowSpinner(true);
          setSeaTurtleListItems(await SeaTurtleService.getSeaTurtleListItems());
        }
        finally {
          setShowSpinner(false);
        }
      };
      fetchSeaTurtleListItems();
    } else {
      var now = new Date();
      var quarter = Math.floor((now.getMonth() / 3));
      var dateFrom = new Date(now.getFullYear(), quarter * 3, 1);
      var dateFromString = convertDateToYyyyMmDdString(dateFrom);
      var dateThru = new Date(dateFrom.getFullYear(), dateFrom.getMonth() + 3, 0);
      var dateThruString = convertDateToYyyyMmDdString(dateThru);
      const initialValues = { dateFrom: dateFromString, dateThru: dateThruString };
      reset(initialValues);
    }
  }, [reportListItem.reportId, reset]);

  useMount(() => {
    Modal.setAppElement('#app')
  });

  const onSubmit = handleSubmit((reportOptions: any) => {
    console.log('reportOptions', reportOptions);
    onGenerate(reportListItem, reportOptions);
  });

  return (
    <Modal isOpen={isActive}>
      <div className={`modal ${isActive ? 'is-active' : ''}`}>
        <Spinner isActive={showSpinner} />
        <FormContext {...methods} >
          <form>
            <div className='modal-background'></div>
            <div className='modal-card'>
              <header className='modal-card-head'>
                <p className='modal-card-title'>Report Options</p>
              </header>
              <section className='modal-card-body'>
                {reportListItem.reportId !== 'TaggingDataForm' ?
                  <>
                    <FormFieldRow>
                      <DateFormField fieldName='dateFrom' labelText='Date from' />
                      <DateFormField fieldName='dateThru' labelText='Date thru' />
                    </FormFieldRow>
                  </>
                : null}
                {reportListItem.reportId === 'MarineTurtleHoldingFacilityQuarterlyReport' ?
                  <>
                    <FormFieldRow>
                      <CheckboxFormField fieldName='includeAnomalies' labelText='Include anomalies' />
                    </FormFieldRow>
                    <FormFieldRow>
                      <CheckboxFormField fieldName='includeAcquiredFrom' labelText='Include acquired from' />
                    </FormFieldRow>
                    <FormFieldRow>
                      <CheckboxFormField fieldName='includeTurtleName' labelText='Include turtle name in SID # box' />
                    </FormFieldRow>
                    <RadioButtonGroupFormField fieldName='groupTankDataBy' labelText='Group tank data by' >
                      <RadioButtonFormField fieldName='groupTankDataBy' labelText='Tank' value='tank' defaultChecked={true} />
                      <br />
                      <RadioButtonFormField fieldName='groupTankDataBy' labelText='Date' value='date' />
                    </RadioButtonGroupFormField>
                  </>
                : null}
                {(reportListItem.reportId === 'MarineTurtleCaptiveFacilityQuarterlyReportForHatchlings'
                  || reportListItem.reportId === 'MarineTurtleCaptiveFacilityQuarterlyReportForWashbacks') ?
                  <>
                    <TextareaFormField fieldName='comments' labelText='Comments' />
                    <FormFieldRow>
                      <CheckboxFormField fieldName='includeDoaCounts' labelText='Include DOA counts by species for this period' />
                    </FormFieldRow>
                  </>
                : null}
                {reportListItem.reportId === 'TaggingDataForm' ?
                  <>
                    <FormFieldRow>
                      <ListFormField fieldName='seaTurtleId' labelText='Choose a turtle to generate the form for' listItems={seaTurtleListItems} />
                    </FormFieldRow>
                    <FormFieldRow>
                      <CheckboxFormField fieldName='populateFacilityField' labelText='Populate "Facility where turtle was being held" field' />
                    </FormFieldRow>
                    <FormFieldRow>
                      <CheckboxFormField fieldName='additionalRemarksOrDataOnBackOfForm' labelText='Additional remarks or data on back of form' />
                    </FormFieldRow>
                    <FormFieldRow>
                      <CheckboxFormField fieldName='printSidOnForm' labelText='Print SID on form' />
                    </FormFieldRow>
                    <RadioButtonGroupFormField fieldName='useMorphometricsClosestTo' labelText='Morphometrics' >
                      <RadioButtonFormField fieldName='useMorphometricsClosestTo' labelText='Use morphometrics closest to date acquired' value='dateAcquired' defaultChecked={true} />
                      <br />
                      <RadioButtonFormField fieldName='useMorphometricsClosestTo' labelText='Use morphometrics closest to date relinquished' value='dateRelinquished' />
                    </RadioButtonGroupFormField>
                  </>
                : null }
                {/* <FormFieldRow>
                  <TextFormField fieldName='organizationName' labelText='Organization Name' />
                  <TextFormField fieldName='permitNumber' labelText='Permit Number' />
                  <TextFormField fieldName='contactName' labelText='Contact Name' />
                </FormFieldRow> */}
              </section>
              <footer className='modal-card-foot'>
                <button className='button is-success' type='submit' onClick={onSubmit}>Generate</button>
                <button className='button is-danger' type='button' onClick={onCancel}>Cancel</button>
              </footer>
            </div>
          </form>
        </FormContext>
      </div>
    </Modal>
  );
};

export default ReportOptionsDialog;
