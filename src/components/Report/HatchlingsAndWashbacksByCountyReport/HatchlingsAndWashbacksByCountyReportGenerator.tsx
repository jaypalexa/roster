import ReportOptionsDateRangeDto from 'dtos/ReportOptions/ReportOptionsDateRangeDto';
import ContentDto from 'dtos/ReportResponses/HatchlingsAndWashbacksByCountyReport/ContentDto';
import DetailItemDto from 'dtos/ReportResponses/HatchlingsAndWashbacksByCountyReport/DetailItemDto';
import PercentageOfGrandTotalDto from 'dtos/ReportResponses/HatchlingsAndWashbacksByCountyReport/PercentageOfGrandTotalDto';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React from 'react';
import OrganizationService from 'services/OrganizationService';
import ReportService from 'services/ReportService';
import { constants } from 'utils';
import './HatchlingsAndWashbacksByCountyReport.sass';

const HatchlingsAndWashbacksByCountyReportGenerator = {
  
  async generate(reportDefinition: ReportDefinitionModel, reportOptions: ReportOptionsDateRangeDto): Promise<JSX.Element> {
    const organization = await OrganizationService.getOrganization();
    const reportData = await ReportService.getHtmlReportData<ContentDto>(reportDefinition.reportId, reportOptions);

    const renderDetailItem = (countyName: string, detailName: string, detailItem: DetailItemDto) => {
      return <tr key={`${countyName}-${detailName}`}>
        <td className='white-space-nowrap'>{detailName}</td>
        <td className='text-align-right'>{detailItem.hatchlingsAcquired}</td>
        <td className='text-align-right'>{detailItem.hatchlingsDoa}</td>
        <td className='text-align-right'>{detailItem.washbacksUnder5cmAcquired}</td>
        <td className='text-align-right'>{detailItem.washbacksOver5cmAcquired}</td>
        <td className='text-align-right'>{detailItem.washbacksUnder5cmDoa}</td>
        <td className='text-align-right'>{detailItem.washbacksOver5cmDoa}</td>
      </tr>
    }

    const renderPercentageOfGrandTotal = (countyName: string, percentageOfGrandTotal: PercentageOfGrandTotalDto) => {
      return <tr key={`${countyName}-percentage-of-grand-total`}>
        <td className='white-space-nowrap'>% of Grand Total</td>
        <td className='text-align-right'>{percentageOfGrandTotal.hatchlingsAcquired.toFixed(2)}%</td>
        <td className='text-align-right'>{percentageOfGrandTotal.hatchlingsDoa.toFixed(2)}%</td>
        <td className='text-align-right'>{percentageOfGrandTotal.washbacksUnder5cmAcquired.toFixed(2)}%</td>
        <td className='text-align-right'>{percentageOfGrandTotal.washbacksOver5cmAcquired.toFixed(2)}%</td>
        <td className='text-align-right'>{percentageOfGrandTotal.washbacksUnder5cmDoa.toFixed(2)}%</td>
        <td className='text-align-right'>{percentageOfGrandTotal.washbacksOver5cmDoa.toFixed(2)}%</td>
      </tr>
    }

    const contents = <>
      <div id='hatchlingsAndWashbacksByCountyReport'>
        <h1 className='title'>{reportDefinition.reportName}</h1>
        <h2 className='subtitle'>{reportOptions.dateFrom} - {reportOptions.dateThru}</h2>
        <h2 className='subtitle'>{organization.organizationName} - {organization.permitNumber}</h2>

        {reportData.countyCounts.length === 0 
        ? <p className='has-text-centered'>{constants.REPORTS.NO_ITEMS_FOUND}</p> 
        : <>
          {reportData.countyCounts.map(item => {
            return <div key={item.countyName || '(no county)'}>
              <table className='html-report-detail-table'>
                <thead>
                  <tr>
                    <th className='county-name-column'>{item.countyName || '(no county)'}</th>
                    <th>Hatchlings Acquired</th>
                    <th>Hatchlings DOA</th>
                    <th>Washbacks Acquired<br />{`(< 5cm)`}</th>
                    <th>Washbacks Acquired<br />{`(>= 5cm)`}</th>
                    <th>Washbacks DOA<br />{`(< 5cm)`}</th>
                    <th>Washbacks DOA<br />{`(>= 5cm)`}</th>
                  </tr>
                </thead>
                <tbody>
                  {renderDetailItem(item.countyName, 'Cc', item.ccCount)}
                  {renderDetailItem(item.countyName, 'Cm', item.cmCount)}
                  {renderDetailItem(item.countyName, 'Dc', item.dcCount)}
                  {renderDetailItem(item.countyName, 'Other', item.otherCount)}
                  {renderDetailItem(item.countyName, 'Unknown', item.unknownCount)}
                  {renderDetailItem(item.countyName, item.countyName === 'ALL COUNTIES' ? 'GRAND TOTAL' : 'SUBTOTAL', item.totalCount)}
                  {item.countyName !== 'ALL COUNTIES' ? renderPercentageOfGrandTotal(item.countyName, item.percentageOfGrandTotal) : null}
                </tbody>
              </table>
              <br />
            </div>
            })
          }
          </>
        }
      </div>
    </>
    return contents;
  },
 
}

export default HatchlingsAndWashbacksByCountyReportGenerator;