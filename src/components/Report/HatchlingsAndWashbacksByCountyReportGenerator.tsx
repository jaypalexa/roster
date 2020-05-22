import ReportOptionsDateRangeDto from 'dtos/ReportOptions/ReportOptionsDateRangeDto';
import HatchlingsAndWashbacksByCountyReportContentDto from 'dtos/ReportResponses/HatchlingsAndWashbacksByCountyReportContentDto';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React from 'react';
import OrganizationService from 'services/OrganizationService';
import ReportService from 'services/ReportService';
import './HatchlingsAndWashbacksByCountyReport.sass';

const HatchlingsAndWashbacksByCountyReportGenerator = {
  
  async generate(reportDefinition: ReportDefinitionModel, reportOptions: ReportOptionsDateRangeDto): Promise<JSX.Element> {
    const organization = await OrganizationService.getOrganization();
    const reportData = await ReportService.getHtmlReportData<HatchlingsAndWashbacksByCountyReportContentDto>(reportDefinition.reportId, reportOptions);

    const contents = <>
      <div id='hatchlingsAndWashbacksByCountyReport'>
        <h1 className='title'>{reportDefinition.reportName}</h1>
        <h2 className='subtitle'>{reportOptions.dateFrom} - {reportOptions.dateThru}</h2>
        <h2 className='subtitle'>{organization.organizationName} - {organization.permitNumber}</h2>

        {reportData.detailItems.length === 0 ? <p className='has-text-centered'>No records meet the specified criteria.</p> 
        : <>
          <table className='html-report-detail-table'>
            <thead>
              <tr>
                <th>County</th>
                <th>Hatchlings Acquired</th>
                <th>Hatchlings DOA</th>
                <th>{`Washbacks Acquired (< 5cm)`}</th>
                <th>{`Washbacks Acquired (>= 5cm)`}</th>
                <th>{`Washbacks DOA (< 5cm)`}</th>
                <th>{`Washbacks DOA (>= 5cm)`}</th>
              </tr>
            </thead>
            <tbody>
            {/* {
              reportData.countyCounts.map(item => {
                return <tr key={item.countyName}>
                  <td>{item.ccCount}</td>
                  <td>{item.cmCount}</td>
                  <td>{item.dcCount}</td>
                  <td>{item.otherCount}</td>
                  <td>{item.unknownCount}</td>
                  <td>{item.totalCount}</td>
                </tr>
              })
            } */}
            </tbody>
          </table>
        </>}
      </div>
    </>
  
    return contents;
  },
 
}

export default HatchlingsAndWashbacksByCountyReportGenerator;