import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import DateFormField from 'components/FormFields/DateFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import ListFormField from 'components/FormFields/ListFormField';
import RadioButtonFormField from 'components/FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from 'components/FormFields/RadioButtonGroupFormField';
import TextareaFormField from 'components/FormFields/TextareaFormField';
import Spinner from 'components/Spinner/Spinner';
import NameValuePair from 'models/NameValuePair';
import ReportListItemModel from 'models/ReportListItemModel';
import React, { useEffect, useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import SeaTurtleService from 'services/SeaTurtleService';
import { handleModalKeyDownEvent } from 'utils';

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
  const generateButtonRef = useRef<HTMLButtonElement>(null);

  const convertDateToYyyyMmDdString = (dateValue: Date) => {
    return new Date(dateValue.getTime() - (dateValue.getTimezoneOffset() * 60000 )).toISOString().split('T')[0];
  }

  useEffect(() => {
    if (!isActive) return;
    generateButtonRef?.current?.focus();
    document.addEventListener('keydown', handleModalKeyDownEvent);
    return () => {
      document.removeEventListener('keydown', handleModalKeyDownEvent);
    }
  }, [isActive]);

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

  const renderQuarterDateRange = () => {
    return (
      <>
        <FormFieldRow>
          <DateFormField fieldName='dateFrom' labelText='Date from' />
          <DateFormField fieldName='dateThru' labelText='Date thru' />
        </FormFieldRow>
      </>
    );
  };

  const onSubmit = handleSubmit((reportOptions: any) => {
    console.log('reportOptions', reportOptions);
    onGenerate(reportListItem, reportOptions);
  });

  return (
    isActive ?
      <div className={`modal ${isActive ? 'is-active' : ''}`}>
        <Spinner isActive={showSpinner} />
        <div className='modal-background'></div>
        <div className='modal-card'>
          <FormContext {...methods} >
            <form>
              <header className='modal-card-head'>
                <p className='modal-card-title'>Report Options</p>
              </header>
              <section className='modal-card-body'>
                {reportListItem.reportId === 'MarineTurtleHoldingFacilityQuarterlyReport' ?
                  <>
                    {renderQuarterDateRange()}
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
                    {renderQuarterDateRange()}
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
                    <RadioButtonGroupFormField fieldName='useMorphometricsClosestTo' labelText='Use morphometrics closest to ' >
                      <RadioButtonFormField fieldName='useMorphometricsClosestTo' labelText='Date acquired' value='dateAcquired' defaultChecked={true} />
                      <br />
                      <RadioButtonFormField fieldName='useMorphometricsClosestTo' labelText='Date relinquished' value='dateRelinquished' />
                    </RadioButtonGroupFormField>
                  </>
                : null }
              </section>
              <footer className='modal-card-foot'>
                <button className='button is-success' type='submit' onClick={onSubmit} ref={generateButtonRef}>Generate</button>
                <button className='button is-danger' type='button' onClick={onCancel}>Cancel</button>
              </footer>
            </form>
          </FormContext>
        </div>
      </div>
    : null
  );
};

export default ReportOptionsDialog;
