import browserHistory from 'browserHistory';
import Spinner from 'components/Spinner/Spinner';
import React, { useState } from 'react';
import ReportService from 'services/ReportService';
import './Reports.sass';

const Reports: React.FC = () => {

  const [pdfData, setPdfData] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);

  const fetchReport = async () => {
    setShowSpinner(true)
    const report = await ReportService.getReport('DisorientationIncidentReportForm');
    setPdfData(`data:application/pdf;base64,${report.data}`);
    setPdfUrl(report.url);
    // window.open(report.url);
    setShowSpinner(false)
  };

  return (
    <div id='reports'>
      <Spinner isActive={showSpinner} />
      <div className='columns'>
        <div className='column has-text-centered'>
          <h1 className='title has-text-centered'>Reports</h1>
          <button className='button is-dark' onClick={() => browserHistory.push('/')}>Home</button>
          <hr />
          <h2 className='subtitle has-text-centered'>TEST</h2>
          <button className='button' onClick={fetchReport}>Fetch Report</button>
          <div>
            {/* <iframe src={pdfData}></iframe> */}
            <object 
              style={{height: '85vh'}} 
              // data={'https://www.turtlegeek.com/pdf/test.pdf'} 
              data={pdfData} 
              type='application/pdf' 
              width='100%' 
              height='100%'
              title='moo'
              name='mew'
            >
                <a href={pdfUrl} title='report'>Report</a>
            </object>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
