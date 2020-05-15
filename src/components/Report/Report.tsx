import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import DateFormField from 'components/FormFields/DateFormField';
import FormFieldGroup from 'components/FormFields/FormFieldGroup';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import ListFormField from 'components/FormFields/ListFormField';
import RadioButtonFormField from 'components/FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from 'components/FormFields/RadioButtonGroupFormField';
import TextareaFormField from 'components/FormFields/TextareaFormField';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import NameValuePair from 'models/NameValuePair';
import ReportListItemModel from 'models/ReportListItemModel';
import React, { useEffect, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthenticationService from 'services/AuthenticationService';
import ReportService from 'services/ReportService';
import SeaTurtleService from 'services/SeaTurtleService';
import { constants } from 'utils';
import './Report.sass';

type TParams =  { reportId: string };

const Report: React.FC<RouteComponentProps<TParams>> = ({match}) => {
  // console.log('match.params.reportId', match.params.reportId);
  const methods = useForm<any>({ mode: 'onChange' });
  const { handleSubmit, reset } = methods;
  const [currentReportListItem, setCurrentReportListItem] = useState({} as ReportListItemModel);
  const [seaTurtleListItems, setSeaTurtleListItems] = useState([] as Array<NameValuePair>);
  const [pdfUrl, setPdfUrl] = useState<string>();
  const [showSpinner, setShowSpinner] = useState(false);

  const convertDateToYyyyMmDdString = (dateValue: Date) => {
    return new Date(dateValue.getTime() - (dateValue.getTimezoneOffset() * 60000 )).toISOString().split('T')[0];
  }

  const renderQuarterDateRange = () => {
    return (
      <>
        <DateFormField fieldName='dateFrom' labelText='Date from' />
        <DateFormField fieldName='dateThru' labelText='Date thru' />
      </>
    );
  };

  useMount(() => {
    const fetchReportListItem = async () => {
      try {
        setShowSpinner(true);
        const reportListItem = await ReportService.getReportListItem(match.params.reportId);
        setCurrentReportListItem(reportListItem);
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

  useEffect(() => {
    if (currentReportListItem.reportId === 'TaggingDataForm') {
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
  }, [currentReportListItem.reportId, reset]);
  
  // const onSubmit = handleSubmit((modifiedReport: ReportModel) => {
  //   // const patchedReport = { ...currentReport, ...modifiedReport };
  //   // ReportService.saveReport(patchedReport);
  //   // reset(patchedReport);
  //   // setCurrentReport(patchedReport);
  //   toast.success('Record saved');
  // });

  const generatePdfReport = async (reportListItem: ReportListItemModel, reportOptions: any) => {
    AuthenticationService.updateUserActivity();
    if (!reportListItem.isPdf) {
      alert(`TODO:  The ${reportListItem.reportName} is an HTML report.`);
      return;
    }
    setPdfUrl('');
    try {
      setShowSpinner(true)
      const report = await ReportService.generateReport(reportListItem, reportOptions);
      //console.log(report.url);
      setPdfUrl(report.url);
      //setPdfData(`data:application/pdf;base64,${report.data}`);
      //window.open(report.url);
    }
    catch (err) {
      console.log(err);
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false)
    }
  };

  const onSubmit = handleSubmit((reportOptions: any) => {
    console.log('reportOptions', reportOptions);
    generatePdfReport(currentReportListItem, reportOptions);
  });

  return (
    <div id='report'>
      <Spinner isActive={showSpinner} />
      <nav className='breadcrumb shown-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/reports'>Reports</Link></li>
          <li className='is-active'><a href='/#' aria-current='page'>{currentReportListItem.reportName}</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/reports'>&#10094; Reports</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>{currentReportListItem.reportName}</h1>

          <FormContext {...methods} >
            <form onSubmit={onSubmit}>
              {currentReportListItem.reportId === 'MarineTurtleHoldingFacilityQuarterlyReport' ?
                <>
                  <FormFieldRow>
                    {renderQuarterDateRange()}
                    <FormFieldGroup fieldClass='checkbox-group checkboxes-4' labelText='Options'>
                      <CheckboxFormField fieldName='includeAnomalies' labelText='Include anomalies' />
                      <CheckboxFormField fieldName='includeAcquiredFrom' labelText='Include acquired from' />
                      <CheckboxFormField fieldName='includeTurtleName' labelText='Include turtle name in SID # box' />
                    </FormFieldGroup>
                    <RadioButtonGroupFormField fieldName='groupTankDataBy' labelText='Group tank data by' >
                      <RadioButtonFormField fieldName='groupTankDataBy' labelText='Tank' value='tank' defaultChecked={true} />
                      <br />
                      <RadioButtonFormField fieldName='groupTankDataBy' labelText='Date' value='date' />
                    </RadioButtonGroupFormField>
                  </FormFieldRow>
                </>
              : null}
              {(currentReportListItem.reportId === 'MarineTurtleCaptiveFacilityQuarterlyReportForHatchlings'
                || currentReportListItem.reportId === 'MarineTurtleCaptiveFacilityQuarterlyReportForWashbacks') ?
                <>
                  {renderQuarterDateRange()}
                  <TextareaFormField fieldName='comments' labelText='Comments' />
                  <FormFieldRow>
                    <CheckboxFormField fieldName='includeDoaCounts' labelText='Include DOA counts by species for this period' />
                  </FormFieldRow>
                </>
              : null}
              {currentReportListItem.reportId === 'TaggingDataForm' ?
                <>
                  <FormFieldRow>
                    <ListFormField fieldName='seaTurtleId' labelText='Choose a turtle to generate the form for' listItems={seaTurtleListItems} />
                    <FormFieldGroup fieldClass='checkbox-group checkboxes-4' labelText='Options'>
                      <CheckboxFormField fieldName='populateFacilityField' labelText='Populate "Facility where turtle was being held" field' />
                      <CheckboxFormField fieldName='additionalRemarksOrDataOnBackOfForm' labelText='Additional remarks or data on back of form' />
                      <CheckboxFormField fieldName='printSidOnForm' labelText='Print SID on form' />
                    </FormFieldGroup>
                    <RadioButtonGroupFormField fieldName='useMorphometricsClosestTo' labelText='Use morphometrics closest to ' >
                      <RadioButtonFormField fieldName='useMorphometricsClosestTo' labelText='Date acquired' value='dateAcquired' defaultChecked={true} />
                      <br />
                      <RadioButtonFormField fieldName='useMorphometricsClosestTo' labelText='Date relinquished' value='dateRelinquished' />
                    </RadioButtonGroupFormField>
                  </FormFieldRow>
                </>
              : null }

              <div className='field is-grouped form-action-buttons'>
                <p className='control'>
                  <input
                    type='submit'
                    className='button is-success is-fixed-width-medium'
                    value='Generate'
                  />
                </p>
              </div>

            </form>
          </FormContext>

          <hr />

          {pdfUrl ? 
            <div className='view-report-button-container has-text-centered'>
              <a href={pdfUrl} className='view-report-button is-fixed-width-medium' title={currentReportListItem.reportName} target='_blank' rel='noopener noreferrer'>View Report</a>
            </div>
           : null}
        </div>
      </div>
    </div>
  );
};

export default Report;
