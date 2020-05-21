import ReportListItemModel from 'models/ReportListItemModel';
import React from 'react';
import OrganizationService from 'services/OrganizationService';
import SeaTurtleService from 'services/SeaTurtleService';
import './TurtleInjuryReport.sass';

const TurtleInjuryReportGenerator = {
  
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

    const injuryBoatStrikeCount = seaTurtles.filter(x => x.injuryBoatStrike).length;
    const injuryIntestinalImpactionCount = seaTurtles.filter(x => x.injuryIntestinalImpaction).length;
    const injuryLineEntanglementCount = seaTurtles.filter(x => x.injuryLineEntanglement).length;
    const injuryFishHookCount = seaTurtles.filter(x => x.injuryFishHook).length;
    const injuryUpperRespiratoryCount = seaTurtles.filter(x => x.injuryUpperRespiratory).length;
    const injuryAnimalBiteCount = seaTurtles.filter(x => x.injuryAnimalBite).length;
    const injuryFibropapillomaCount = seaTurtles.filter(x => x.injuryFibropapilloma).length;
    const injuryMiscEpidemicCount = seaTurtles.filter(x => x.injuryMiscEpidemic).length;
    const injuryDoaCount = seaTurtles.filter(x => x.injuryDoa).length;
    const injuryOtherCount = seaTurtles.filter(x => x.injuryOther).length;
    const injuryNoneCount = seaTurtles.filter(
      x => !x.injuryBoatStrike && !x.injuryIntestinalImpaction && !x.injuryLineEntanglement
        && !x.injuryFishHook && !x.injuryUpperRespiratory && !x.injuryAnimalBite
        && !x.injuryFibropapilloma && !x.injuryMiscEpidemic && !x.injuryDoa && !x.injuryOther
      ).length;

    const totalCount = seaTurtles.length;

    const contents = <>
      <div id='turtleInjuryReport'>
        <h1 className='title'>{reportListItem.reportName}</h1>
        <h2 className='subtitle'>{reportOptions.dateFrom} - {reportOptions.dateThru}</h2>
        <h2 className='subtitle'>{organization.organizationName} - {organization.permitNumber}</h2>

        {seaTurtles.length === 0 ? <p className='has-text-centered'>No records meet the specified criteria.</p> 
        : <>
          <p className='has-text-centered'>[Note: A turtle may have more than one injury.]</p>
          <table className='html-report-summary-table'>
            <tbody>
              <tr>
                <td className='category'>Boat/Propeller strike:</td>
                <td>{`${injuryBoatStrikeCount} of ${totalCount} (${(100 * injuryBoatStrikeCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Intestinal impaction:</td>
                <td>{`${injuryIntestinalImpactionCount} of ${totalCount} (${(100 * injuryIntestinalImpactionCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Line/Net entanglement:</td>
                <td>{`${injuryLineEntanglementCount} of ${totalCount} (${(100 * injuryLineEntanglementCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Fish hook:</td>
                <td>{`${injuryFishHookCount} of ${totalCount} (${(100 * injuryFishHookCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Upper respiratory:</td>
                <td>{`${injuryUpperRespiratoryCount} of ${totalCount} (${(100 * injuryUpperRespiratoryCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Shark/Bird bite:</td>
                <td>{`${injuryAnimalBiteCount} of ${totalCount} (${(100 * injuryAnimalBiteCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Fibropapilloma:</td>
                <td>{`${injuryFibropapillomaCount} of ${totalCount} (${(100 * injuryFibropapillomaCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Misc. epidemic:</td>
                <td>{`${injuryMiscEpidemicCount} of ${totalCount} (${(100 * injuryMiscEpidemicCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>DOA:</td>
                <td>{`${injuryDoaCount} of ${totalCount} (${(100 * injuryDoaCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>Other:</td>
                <td>{`${injuryOtherCount} of ${totalCount} (${(100 * injuryOtherCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
              <tr>
                <td className='category'>None:</td>
                <td>{`${injuryNoneCount} of ${totalCount} (${(100 * injuryNoneCount / totalCount).toFixed(2)}%)`}</td>
              </tr>
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
              seaTurtles.map(seaTurtle => {
                return <tr key={seaTurtle.seaTurtleId}>
                  <td>{seaTurtle.seaTurtleName || seaTurtle.sidNumber}</td>
                  <td className='has-text-centered'>{seaTurtle.injuryBoatStrike ? 'X' : '' }</td>
                  <td className='has-text-centered'>{seaTurtle.injuryIntestinalImpaction ? 'X' : '' }</td>
                  <td className='has-text-centered'>{seaTurtle.injuryLineEntanglement ? 'X' : '' }</td>
                  <td className='has-text-centered'>{seaTurtle.injuryFishHook ? 'X' : '' }</td>
                  <td className='has-text-centered'>{seaTurtle.injuryUpperRespiratory ? 'X' : '' }</td>
                  <td className='has-text-centered'>{seaTurtle.injuryAnimalBite ? 'X' : '' }</td>
                  <td className='has-text-centered'>{seaTurtle.injuryFibropapilloma ? 'X' : '' }</td>
                  <td className='has-text-centered'>{seaTurtle.injuryMiscEpidemic ? 'X' : '' }</td>
                  <td className='has-text-centered'>{seaTurtle.injuryDoa ? 'X' : '' }</td>
                  <td className='has-text-centered'>{seaTurtle.injuryOther ? 'X' : '' }</td>
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