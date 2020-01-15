// @ts-ignore
// import { pdfform } from 'pdfform.js';
import React from 'react';
// @ts-ignore // could not find module xxx TS2307
import testPdf from '../../assets/pdfs/test.pdf';
import browserHistory from '../../browserHistory';
import './Reports.sass';
// const pdfform = require("./pdfform.minipdf.dist");
// const pdfform = require("pdfform.js");
// const pdfform = require('../../assets/scripts/pdfform.minipdf.dist.js');

const Reports: React.FC = () => {

  var oReq = new XMLHttpRequest();    
  oReq.open('get', '../../assets/pdfs/test.pdf' , true);
  oReq.responseType = 'blob';
  oReq.onload = () => {
      var blob = oReq.response;
      var reader = new FileReader();
      reader.onload = (ev) => {
        const buffer = ev.target?.result;
        // const field_specs = pdfform().list_fields(buffer);
      };
      reader.readAsArrayBuffer(blob);
  };
  oReq.send();

  return (
    <div id='reports'>
      <div className='columns'>
        <div className='column has-text-centered'>
          <h1 className='title has-text-centered'>Reports</h1>
          <button className='button is-dark' onClick={() => browserHistory.push('/')}>Home</button>

          <div>
            <a href={testPdf} target='_blank' rel='noopener noreferrer'>Download Pdf</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
