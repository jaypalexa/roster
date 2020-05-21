import ReportListItemModel from 'models/ReportListItemModel';
import React from 'react';
import OrganizationService from 'services/OrganizationService';
import SeaTurtleService from 'services/SeaTurtleService';
import './TurtleTagReport.sass';

const TurtleTagReportGenerator = {
  
  async generateReport(reportListItem: ReportListItemModel, reportOptions: any): Promise<JSX.Element> {
    const organization = await OrganizationService.getOrganization();
    const seaTurtles = (await SeaTurtleService.getSeaTurtles())
      .filter(x => 
        (x.dateAcquired || '0000-00-00') <= reportOptions.dateThru
        && reportOptions.dateFrom <= (x.dateRelinquished || '9999-99-99')
      ).sort((a, b) => 
        a.sidNumber.localeCompare(b.sidNumber) 
        || a.dateAcquired.toString().localeCompare(b.dateAcquired.toString())
        || a.seaTurtleName.localeCompare(b.seaTurtleName)
      ).map(x => x);

    const contents = <>
      <div id='turtleTagReport'>
        <h1 className='title'>{reportListItem.reportName}</h1>
        <h2 className='subtitle'>{reportOptions.dateFrom} - {reportOptions.dateThru}</h2>
        <h2 className='subtitle'>{organization.organizationName} - {organization.permitNumber}</h2>

        {seaTurtles.length === 0 ? <p className='has-text-centered'>No records meet the specified criteria.</p> 
        : <>
          <table className='html-report-detail-table'>
            <thead>
              <tr>
                <th>SID #</th>
                <th>Turtle Name</th>
                <th>Tag Location/Number</th>
                <th>Date Tagged</th>
                <th>Date Released</th>
                <th>Stranding ID</th>
              </tr>
            </thead>
            <tbody>
            {
              seaTurtles.map((seaTurtle) => {
                return <tr key={seaTurtle.seaTurtleId}>
                  <td>{seaTurtle.sidNumber}</td>
                  <td>{seaTurtle.seaTurtleName}</td>
                  <td>{'Tag Location/Number'}</td>
                  <td>{'Date Tagged'}</td>
                  <td>{'Date Released'}</td>
                  <td>{seaTurtle.strandingIdNumber}</td>
                </tr>
              })
            }
            </tbody>
          </table>
        </>}
      </div>
    </>
  
    return contents;
  },
 
}

export default TurtleTagReportGenerator;