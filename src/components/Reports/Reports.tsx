import browserHistory from 'browserHistory';
import Spinner from 'components/Spinner/Spinner';
import React, { useState } from 'react';
import ApiService, { ApiRequestPayload } from 'services/ApiService';
import './Reports.sass';

const Reports: React.FC = () => {

  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfData, setPdfData] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);

  const fetchReport = async () => {
    setShowSpinner(true)
   
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.httpMethod = 'GET';
    apiRequestPayload.resource = '/reports/{reportName}';
    apiRequestPayload.pathParameters = { reportName: 'DisorientationIncidentReportForm' };
  
    const response = await ApiService.execute(apiRequestPayload);
    console.log('fetchPdfForm response = ', response);
    setPdfData(`data:application/pdf;base64,${response}`);
    //window.open(`data:application/pdf;base64,${response}`);

    const buffer = new Buffer(response, 'base64');
    console.log('fetchPdfForm buffer = ', buffer);

    // const text = buffer.toString('utf8');
    // console.log('text = ', text);

    const blob = new Blob([buffer], { type: 'application/pdf' });
    console.log('fetchPdfForm blob = ', blob);
  
    const url = URL.createObjectURL(blob);
    console.log('fetchPdfForm url = ', url);
    setPdfUrl(url);

    // window.open(url);
    // window.open('https://www.turtlegeek.com/pdf/test.pdf');

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
