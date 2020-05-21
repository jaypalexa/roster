import TurtleTagReportDetailItem from 'dtos/TurtleTagReportDetailItem';
import TurtleTagReportDetailItemTag from 'dtos/TurtleTagReportDetailItemTag';
import ReportListItemModel from 'models/ReportListItemModel';
import React from 'react';
import OrganizationService from 'services/OrganizationService';
import ReportService from 'services/ReportService';
import './TurtleTagReport.sass';

const TurtleTagReportGenerator = {
  
  async generateReport(reportListItem: ReportListItemModel, reportOptions: any): Promise<JSX.Element> {
    console.log('reportOptions', reportOptions);
    const includeStrandingIdNumber = reportOptions.includeStrandingIdNumber;

    const organization = await OrganizationService.getOrganization();
    const reportData = await ReportService.getHtmlReportData<TurtleTagReportDetailItem>(reportListItem.reportId, reportOptions);

    const fetchTagTypeAndNumberValues = (item: TurtleTagReportDetailItem) => {
      if (item.tags.length > 0) {
        return item.tags.map((x: TurtleTagReportDetailItemTag, index) => {
          return <div key={`${item.seaTurtleId}-${index}-tag-value`}>
              <span className='tag-label'>{`${x.label}: `}</span><span>{x.tagNumber}</span>
            </div>
          });
      } else {
        return <></>
      }
    }

    const fetchDateTaggedValues = (item: TurtleTagReportDetailItem) => {
      if (item.tags.length > 0) {
        return item.tags.map((x: TurtleTagReportDetailItemTag, index) => {
          return <div key={`${item.seaTurtleId}-${index}-date-tagged`}>
              <span>{x.dateTagged}</span>
            </div>
          });
      } else {
        return <></>
      }
    }

    const contents = <>
      <div id='turtleTagReport'>
        <h1 className='title'>{reportListItem.reportName}</h1>
        <h2 className='subtitle'>{reportOptions.dateFrom} - {reportOptions.dateThru}</h2>
        <h2 className='subtitle'>{organization.organizationName} - {organization.permitNumber}</h2>

        {reportData.length === 0 ? <p className='has-text-centered'>No records meet the specified criteria.</p> 
        : <>
          <table className='html-report-detail-table'>
            <thead>
              <tr>
                <th>SID #</th>
                <th>Turtle Name</th>
                <th>Tag Location/Number</th>
                <th>Date Tagged</th>
                <th>Date Released</th>
                {includeStrandingIdNumber ? <th>Stranding ID</th> : null}
              </tr>
            </thead>
            <tbody>
            {
              reportData.map(item => {
                return <tr key={item.seaTurtleId}>
                  <td>{item.sidNumber}</td>
                  <td>{item.seaTurtleName}</td>
                  <td>{fetchTagTypeAndNumberValues(item)}</td>
                  <td className='date-value'>{fetchDateTaggedValues(item)}</td>
                  <td className='date-value'>{item.dateRelinquished}</td>
                  {includeStrandingIdNumber ? <td>{item.strandingIdNumber}</td> : null}
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