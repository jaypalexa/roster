import { Typography } from '@material-ui/core';
import TurtleTagReportOptionsDto from 'dtos/ReportOptions/TurtleTagReportOptionsDto';
import ContentDto from 'dtos/ReportResponses/TurtleTagReport/ContentDto';
import DetailItemDto from 'dtos/ReportResponses/TurtleTagReport/DetailItemDto';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React from 'react';
import OrganizationService from 'services/OrganizationService';
import ReportService from 'services/ReportService';
import { constants } from 'utils';
import './TurtleTagReport.sass';

const TurtleTagReportGenerator = {
  
  async generate(reportDefinition: ReportDefinitionModel, reportOptions: TurtleTagReportOptionsDto): Promise<JSX.Element> {
    const organization = await OrganizationService.getOrganization();
    const reportData = await ReportService.getHtmlReportData<ContentDto>(reportDefinition.reportId, reportOptions);

    const fetchTagTypeAndNumberValues = (item: DetailItemDto) => {
      if (item.tags.length > 0) {
        return item.tags.map((tag, index) =>
            <div key={`${item.seaTurtleId}-${index}-tag-value`}>
              <span className='tag-label'>{`${tag.label}: `}</span><span>{tag.tagNumber}</span>
            </div>
          );
      } else {
        return <></>
      }
    }

    const fetchDateTaggedValues = (item: DetailItemDto) => {
      if (item.tags.length > 0) {
        return item.tags.map((tag, index) => 
          <div key={`${item.seaTurtleId}-${index}-date-tagged`}>
            <span>{tag.dateTagged}</span>
          </div>
        );
      } else {
        return <></>
      }
    }

    const contents = <>
      <div id='turtleTagReport' className='html-report-container'>
        <Typography variant='h1' align='center'>{reportDefinition.reportName}</Typography>
        <Typography variant='h2' align='center'>{reportOptions.dateFrom} - {reportOptions.dateThru}</Typography>
        <Typography variant='h2' align='center' gutterBottom={true}>{organization.organizationName} - {organization.permitNumber}</Typography>

        {reportData.detailItems.length === 0 
        ? <Typography variant='h3' align='center'>{constants.REPORTS.NO_ITEMS_FOUND}</Typography>
        : <>
          <table className='html-report-detail-table'>
            <thead>
              <tr>
                <th>SID #</th>
                <th>Turtle Name</th>
                <th>Tag Location/Number</th>
                <th>Date Tagged</th>
                <th>Date Released</th>
                {reportOptions.includeStrandingIdNumber ? <th>Stranding ID</th> : null}
              </tr>
            </thead>
            <tbody>
            {
              reportData.detailItems.map(item => {
                return <tr key={item.seaTurtleId}>
                  <td>{item.sidNumber}</td>
                  <td>{item.seaTurtleName}</td>
                  <td>{fetchTagTypeAndNumberValues(item)}</td>
                  <td className='white-space-nowrap'>{fetchDateTaggedValues(item)}</td>
                  <td className='white-space-nowrap'>{item.dateRelinquished}</td>
                  {reportOptions.includeStrandingIdNumber ? <td>{item.strandingIdNumber}</td> : null}
                </tr>
              })
            }
            </tbody>
          </table>
        </>}
      </div>
    </>

    return contents;
  }
 
}

export default TurtleTagReportGenerator;