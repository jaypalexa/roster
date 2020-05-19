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
import OrganizationService from 'services/OrganizationService';
import ReportService from 'services/ReportService';
import SeaTurtleService from 'services/SeaTurtleService';
import { constants, iOS } from 'utils';
import './Report.sass';

type TParams =  { reportId: string };

const Report: React.FC<RouteComponentProps<TParams>> = ({match}) => {
  // console.log('match.params.reportId', match.params.reportId);
  const methods = useForm<any>({ mode: 'onChange' });
  const { handleSubmit, reset } = methods;
  const [currentReportListItem, setCurrentReportListItem] = useState({} as ReportListItemModel);
  const [seaTurtleListItems, setSeaTurtleListItems] = useState([] as Array<NameValuePair>);
  const [pdfUrl, setPdfUrl] = useState<string>();
  const [showHtmlReport, setShowHtmlReport] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [htmlReportContent, setHtmlReportContent] = useState<JSX.Element>();

  const convertDateToYyyyMmDdString = (dateValue: Date) => {
    return new Date(dateValue.getTime() - (dateValue.getTimezoneOffset() * 60000 )).toISOString().split('T')[0];
  }

  const renderDateRangeControls = () => {
    return (
      <div className='date-range-controls'>
        <DateFormField fieldName='dateFrom' labelText='Date from' />
        <DateFormField fieldName='dateThru' labelText='Date thru' />
      </div>
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

  const clearViewingArea = () => {
    setPdfUrl('');
    setShowHtmlReport(false);
  };

  const buildTurtleInjuryReport = async (reportOptions: any) => {
    try {
      // const report = await ReportService.generateReport(currentReportListItem, reportOptions);
      // setPdfUrl(report.url);
      const organization = await OrganizationService.getOrganization();
      
      // SELECT * FROM turtle
      // WHERE (date_acquired IS NOT NULL) AND (date_acquired <= @date_thru)
      // AND ((date_relinquished IS NULL) OR ((date_relinquished IS NOT NULL) AND (@date_from <= date_relinquished)) )
      // ORDER BY sid_number, date_acquired, turtle_name
      const seaTurtles = (await SeaTurtleService.getSeaTurtles())
        .filter(x => 
          (x.dateAcquired || '0000-00-00') <= reportOptions.dateThru
          && reportOptions.dateFrom <= (x.dateRelinquished || '9999-99-99')
        ).sort((a, b) => 
          a.sidNumber.localeCompare(b.sidNumber) 
          || a.dateAcquired.toString().localeCompare(b.dateAcquired.toString())
          || a.seaTurtleName.localeCompare(b.seaTurtleName)
        ).map(x => x);

      const injuryBoatStrikeCount = seaTurtles.filter(x => x.injuryBoatStrike).length;
      const injuryIntestinalImpactionCount = seaTurtles.filter(x => x.injuryIntestinalImpaction).length;
      const injuryLineEntanglementCount = seaTurtles.filter(x => x.injuryLineEntanglement).length;
      const injuryFishHookCount = seaTurtles.filter(x => x.injuryFishHook).length;
      const injuryUpperRespiratoryCount = seaTurtles.filter(x => x.injuryUpperRespiratory).length;
      const injuryAnimalBiteCount = seaTurtles.filter(x => x.injuryAnimalBite).length;
      const injuryFibropapillomaCount = seaTurtles.filter(x => x.injuryFibropapilloma).length;
      const injuryMiscEpidemicCount = seaTurtles.filter(x => x.injuryMiscEpidemic).length;
      const injuryDoaCount = seaTurtles.filter(x => x.injuryDoa).length;
      const injuryOtherCount = seaTurtles.filter(x => x.injuryOther).length;
      const injuryNoneCount = seaTurtles.filter(
        x => !x.injuryBoatStrike && !x.injuryIntestinalImpaction && !x.injuryLineEntanglement
          && !x.injuryFishHook && !x.injuryUpperRespiratory && !x.injuryAnimalBite
          && !x.injuryFibropapilloma && !x.injuryMiscEpidemic && !x.injuryDoa && !x.injuryOther
        ).length;

      const totalCount = seaTurtles.length;

      return <div className='turtle-injury-report'>
        <h1 className='title'>{currentReportListItem.reportName}</h1>
        <h2 className='subtitle'>{reportOptions.dateFrom} - {reportOptions.dateThru}</h2>
        <h2 className='subtitle'>{organization.organizationName} - {organization.permitNumber}</h2>

        {seaTurtles.length === 0 ? <p className='has-text-centered'>No records meet the specified criteria.</p> : <>
          <p className='has-text-centered'>[Note: A turtle may have more than one injury.]</p>
          <table className='html-report-summary-table'>
            <tbody>
              <tr>
                <td className='category'>Boat/Propeller strike:</td>
                <td>{`${injuryBoatStrikeCount} of ${totalCount} (${(100 * injuryBoatStrikeCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Intestinal impaction:</td>
                <td>{`${injuryIntestinalImpactionCount} of ${totalCount} (${(100 * injuryIntestinalImpactionCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Line/Net entanglement:</td>
                <td>{`${injuryLineEntanglementCount} of ${totalCount} (${(100 * injuryLineEntanglementCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Fish hook:</td>
                <td>{`${injuryFishHookCount} of ${totalCount} (${(100 * injuryFishHookCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Upper respiratory:</td>
                <td>{`${injuryUpperRespiratoryCount} of ${totalCount} (${(100 * injuryUpperRespiratoryCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Shark/Bird bite:</td>
                <td>{`${injuryAnimalBiteCount} of ${totalCount} (${(100 * injuryAnimalBiteCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Fibropapilloma:</td>
                <td>{`${injuryFibropapillomaCount} of ${totalCount} (${(100 * injuryFibropapillomaCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Misc. epidemic:</td>
                <td>{`${injuryMiscEpidemicCount} of ${totalCount} (${(100 * injuryMiscEpidemicCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>DOA:</td>
                <td>{`${injuryDoaCount} of ${totalCount} (${(100 * injuryDoaCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Other:</td>
                <td>{`${injuryOtherCount} of ${totalCount} (${(100 * injuryOtherCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>None:</td>
                <td>{`${injuryNoneCount} of ${totalCount} (${(100 * injuryNoneCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
            </tbody>
          </table>
        <table className='html-report-detail-table'>
          <thead>
            <tr>
              <th>Turtle Name</th>
              <th className='has-text-centered'>Strike</th>
              <th className='has-text-centered'>Intest</th>
              <th className='has-text-centered'>Tangle</th>
              <th className='has-text-centered'>Hook</th>
              <th className='has-text-centered'>UpResp</th>
              <th className='has-text-centered'>Bite</th>
              <th className='has-text-centered'>Pap</th>
              <th className='has-text-centered'>Epidem</th>
              <th className='has-text-centered'>DOA</th>
              <th className='has-text-centered'>Other</th>
            </tr>
          </thead>
          <tbody>
          {
            seaTurtles.map((seaTurtle) => {
              return <tr key={seaTurtle.seaTurtleId}>
                <td>{seaTurtle.seaTurtleName || seaTurtle.sidNumber}</td>
                <td className='has-text-centered'>{seaTurtle.injuryBoatStrike ? 'X' : '' }</td>
                <td className='has-text-centered'>{seaTurtle.injuryIntestinalImpaction ? 'X' : '' }</td>
                <td className='has-text-centered'>{seaTurtle.injuryLineEntanglement ? 'X' : '' }</td>
                <td className='has-text-centered'>{seaTurtle.injuryFishHook ? 'X' : '' }</td>
                <td className='has-text-centered'>{seaTurtle.injuryUpperRespiratory ? 'X' : '' }</td>
                <td className='has-text-centered'>{seaTurtle.injuryAnimalBite ? 'X' : '' }</td>
                <td className='has-text-centered'>{seaTurtle.injuryFibropapilloma ? 'X' : '' }</td>
                <td className='has-text-centered'>{seaTurtle.injuryMiscEpidemic ? 'X' : '' }</td>
                <td className='has-text-centered'>{seaTurtle.injuryDoa ? 'X' : '' }</td>
                <td className='has-text-centered'>{seaTurtle.injuryOther ? 'X' : '' }</td>
              </tr>
            })
          }
          </tbody>
        </table>
        </>}
      </div>
    }
    catch (err) {
      console.log(err);
      toast.error(constants.ERROR.GENERIC);
      return undefined;
    }
  };

  const generateHtmlReport = async (reportOptions: any) => {
    try {
      setShowSpinner(true)
      clearViewingArea();
  
      switch (currentReportListItem.reportId) {
        case 'TurtleInjuryReport':
          setHtmlReportContent(await buildTurtleInjuryReport(reportOptions))
          break;
      
        default:
          break;
      }

      setShowHtmlReport(true);
    }
    catch (err) {
      console.log(err);
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false)
    }
  };

  const generatePdfReport = async (reportOptions: any) => {
    clearViewingArea();
    try {
      setShowSpinner(true)
      const report = await ReportService.generateReport(currentReportListItem, reportOptions);
      //console.log(report.url);
      setPdfUrl(report.url);
      //setPdfData(`data:application/pdf;base64,${report.data}`);
      //window.open(report.url);

      // var link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;
      // link.href = report.url;
      // link.target = iOS ? '_self' : '_blank';
      // var event = new MouseEvent('click', {
      //     'view': window,
      //     'bubbles': false,
      //     'cancelable': true
      // });
      // link.dispatchEvent(event);
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
    AuthenticationService.updateUserActivity();
    console.log('reportOptions', reportOptions);
    if (currentReportListItem.isPdf) {
      generatePdfReport(reportOptions);
    } else {
      generateHtmlReport(reportOptions);
    }
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
          <div className='report-options'>
            <h1 className='title has-text-centered'>{currentReportListItem.reportName} Options</h1>

            <FormContext {...methods} >
              <form onSubmit={onSubmit}>
                {currentReportListItem.reportId === 'TurtleInjuryReport' ?
                  <>
                    <FormFieldRow>
                      {renderDateRangeControls()}
                    </FormFieldRow>
                  </>
                : null}
                {currentReportListItem.reportId === 'MarineTurtleHoldingFacilityQuarterlyReport' ?
                  <>
                    <FormFieldRow>
                      {renderDateRangeControls()}
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
                    {renderDateRangeControls()}
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
          </div>

          {pdfUrl ? 
            <div className='view-report-button-container has-text-centered'>
              <a href={pdfUrl} 
                className='view-report-button is-fixed-width-medium' 
                title={currentReportListItem.reportName} 
                target={iOS ? '_self' : '_blank'} 
                rel='noopener noreferrer'
              >
                  View Report
              </a>
            </div>
           : null}

           {showHtmlReport ?
            <>
            <div className='has-text-centered html-report-print-button-container'>
              <input
                type='button'
                className='button is-fixed-width-medium html-report-print-button'
                value='Print' 
                onClick={() => { window.print() }}
              />
            </div>
            <div className='has-text-centered html-report-viewing-area'>
              {htmlReportContent}
            </div>
            </>
           : null}
        </div>
      </div>
    </div>
  );
};

export default Report;
