import browserHistory from 'browserHistory';
import React, { useState } from 'react';
import ApiService, { ApiRequestPayload } from 'services/ApiService';
import './Reports.sass';

const Reports: React.FC = () => {

  const [pdfBlob, setPdfBlob] = useState<Blob>();
  const [pdfUrl, setPdfUrl] = useState('');

  const fetchPdfForm = async () => {
    
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.httpMethod = 'GET';
    apiRequestPayload.resource = '/fetch-pdf-form/{pdfFormName}';
    apiRequestPayload.pathParameters = { pdfFormName: 'RosterTagRequestForm' };
  
    const response = await ApiService.execute(apiRequestPayload);
    console.log('fetchPdfForm response = ', response);
  
    const buffer = new Uint8Array(response.data).buffer;

    const blob = new Blob([buffer], { type: 'application/pdf' });
    console.log('fetchPdfForm blob = ', blob);
    setPdfBlob(blob);
  
    const url = URL.createObjectURL(blob);
    console.log('fetchPdfForm url = ', url);
    setPdfUrl(url);

    // window.open(url);
    window.open('https://www.turtlegeek.com/pdf/test.pdf');
  };

  return (
    <div id='reports'>
      <div className='columns'>
        <div className='column has-text-centered'>
          <h1 className='title has-text-centered'>Reports</h1>
          <button className='button is-dark' onClick={() => browserHistory.push('/')}>Home</button>
          <hr />
          <h2 className='subtitle has-text-centered'>TEST</h2>
          <button className='button' onClick={fetchPdfForm}>TEST</button>
          <div>
            <p>PDF</p>
            <object 
              style={{height: '85vh'}} 
              data={'https://www.turtlegeek.com/pdf/test.pdf'} 
              type="application/pdf" 
              width='100%' 
              height='100%'>
                <a href={pdfUrl}>alt</a>
            </object>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
