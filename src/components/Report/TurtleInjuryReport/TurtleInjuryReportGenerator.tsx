import ReportOptionsDateRangeDto from 'dtos/ReportOptions/ReportOptionsDateRangeDto';
import ContentDto from 'dtos/ReportResponses/TurtleInjuryReport/ContentDto';
import SummaryItemDto from 'dtos/ReportResponses/TurtleInjuryReport/SummaryItemDto';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React from 'react';
import OrganizationService from 'services/OrganizationService';
import ReportService from 'services/ReportService';
import { constants } from 'utils';
import './TurtleInjuryReport.sass';

const TurtleInjuryReportGenerator = {
  
  async generate(reportDefinition: ReportDefinitionModel, reportOptions: ReportOptionsDateRangeDto): Promise<JSX.Element> {
    const organization = await OrganizationService.getOrganization();
    const reportData = await ReportService.getHtmlReportData<ContentDto>(reportDefinition.reportId, reportOptions);

    const renderSummaryItem = (item: SummaryItemDto, index: number, totalCount: number) =>
      <tr key={`${item.seaTurtleId}=summary-item-${index}`}>
        <td className='category'>{item.label}:</td>
        <td>{`${item.count} of ${totalCount} (${item.percentageOfTotal.toFixed(2)}%)`}</td>
      </tr>

    const contents = <>
      <div id='turtleInjuryReport'>
        <h1 className='title'>{reportDefinition.reportName}</h1>
        <h2 className='subtitle'>{reportOptions.dateFrom} - {reportOptions.dateThru}</h2>
        <h2 className='subtitle'>{organization.organizationName} - {organization.permitNumber}</h2>

        {reportData.detailItems.length === 0 
        ? <p className='has-text-centered'>{constants.REPORTS.NO_ITEMS_FOUND}</p> 
        : <>
          <p className='has-text-centered'>[Note: A turtle may have more than one injury.]</p>
          <table className='html-report-summary-table'>
            <tbody>
              {reportData.summaryItems.map((item, index) => renderSummaryItem(item, index, reportData.totalCount))}
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
              reportData.detailItems.map(item => {
                return <tr key={item.seaTurtleId}>
                  <td>{item.seaTurtleName || item.sidNumber}</td>
                  <td className='has-text-centered'>{item.injuryBoatStrike ? 'X' : '' }</td>
                  <td className='has-text-centered'>{item.injuryIntestinalImpaction ? 'X' : '' }</td>
                  <td className='has-text-centered'>{item.injuryLineEntanglement ? 'X' : '' }</td>
                  <td className='has-text-centered'>{item.injuryFishHook ? 'X' : '' }</td>
                  <td className='has-text-centered'>{item.injuryUpperRespiratory ? 'X' : '' }</td>
                  <td className='has-text-centered'>{item.injuryAnimalBite ? 'X' : '' }</td>
                  <td className='has-text-centered'>{item.injuryFibropapilloma ? 'X' : '' }</td>
                  <td className='has-text-centered'>{item.injuryMiscEpidemic ? 'X' : '' }</td>
                  <td className='has-text-centered'>{item.injuryDoa ? 'X' : '' }</td>
                  <td className='has-text-centered'>{item.injuryOther ? 'X' : '' }</td>
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

export default TurtleInjuryReportGenerator;