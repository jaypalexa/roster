import browserHistory from 'browserHistory';
import ReportOptionsFormFields from 'components/ReportOptions/ReportOptionsFormFields';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import ReportListItemModel from 'models/ReportListItemModel';
import ReportRouteStateModel from 'models/ReportRouteStateModel';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthenticationService from 'services/AuthenticationService';
import ReportService from 'services/ReportService';
import { constants } from 'utils';
import './ReportOptions.sass';

type ReportOptionsParams = { reportId: string };

const ReportOptions: React.FC<RouteComponentProps<ReportOptionsParams>> = ({match}) => {
  const methods = useForm<any>({ mode: 'onChange' });
  const { handleSubmit } = methods;
  const [currentReportListItem, setCurrentReportListItem] = useState({} as ReportListItemModel);
  const [showSpinner, setShowSpinner] = useState(false);
  const [appContext, setAppContext] = useAppContext();

  useMount(() => {
    window.scrollTo(0, 0);
  });

  useMount(() => {
    const fetchReportListItem = async () => {
      try {
        setShowSpinner(true);
        const reportListItem = ReportService.getReportListItem(match.params.reportId);
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

  const onSubmit = handleSubmit(async (reportOptions: any) => {
    AuthenticationService.updateUserActivity();
    appContext.reportOptions[currentReportListItem.reportId] = reportOptions;
    setAppContext({ ...appContext, reportOptions: appContext.reportOptions });
    setTimeout(() => {
      const reportRouteState = {} as ReportRouteStateModel;
      reportRouteState.currentReportListItem = currentReportListItem;
      reportRouteState.reportOptions = reportOptions;

      browserHistory.push('/report', reportRouteState);
    }, 0);
  });

  return (
    <div id='reportOptions'>
      <Spinner isActive={showSpinner} />
      <nav className='breadcrumb hidden-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/reports'>Reports</Link></li>
          <li className='is-active'><a href='/#' aria-current='page'>Report Options</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb hidden-when-not-mobile' aria-label='breadcrumbs'>
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
                <ReportOptionsFormFields currentReportListItem={currentReportListItem} setShowSpinner={setShowSpinner} />
                <div className='field is-grouped form-action-buttons'>
                  <p className='control'>
                    <input type='submit' className='button is-success is-fixed-width-medium' value='Generate' />
                  </p>
                </div>
              </form>
            </FormContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportOptions;
