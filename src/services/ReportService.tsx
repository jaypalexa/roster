import ApiService, { ApiRequestPayload } from 'services/ApiService';
import ReportListItemModel from 'types/ReportListItemModel';
import ReportModel from 'types/ReportModel';

const reports = [
  { reportId: 'DisorientationIncidentForm', reportName: 'Disorientation Incident Form', canGenerate: false, isPdf: true, blankFileName: 'Disorientation Incident Report form.pdf' },
  { reportId: 'DisorientationIncidentFormDirections', reportName: 'Disorientation Incident Form Directions', canGenerate: false, isPdf: true, blankFileName: 'Disorientation Incident Report form directions.pdf' },
  { reportId: 'EducationalPresentationsUsingTurtles', reportName: 'Educational Presentations Using Turtles', canGenerate: false, isPdf: true, blankFileName: 'Educational Presentation form.pdf' },
  { reportId: 'HatchlingsandWashbacksByCountyReport', reportName: 'Hatchlings and Washbacks by County Report', canGenerate: true, isPdf: false },
  { reportId: 'MarineTurtleCaptiveFacilityQuarterlyReportForHatchlings', reportName: 'Marine Turtle Captive Facility Quarterly Report for Hatchlings', canGenerate: true, isPdf: true, blankFileName: 'Marine Turtle Captive Facility Quarterly Report For Hatchlings.pdf' },
  { reportId: 'MarineTurtleCaptiveFacilityQuarterlyReportForWashbacks', reportName: 'Marine Turtle Captive Facility Quarterly Report for Washbacks', canGenerate: true, isPdf: true, blankFileName: 'Marine Turtle Captive Facility Quarterly Report For Washbacks.pdf' },
  { reportId: 'MarineTurtleHoldingFacilityQuarterlyReport', reportName: 'Marine Turtle Holding Facility Quarterly Report', canGenerate: true, isPdf: true, blankFileName: 'Marine Turtle Holding Facility Quarterly Report.pdf' },
  { reportId: 'MonitoringforBeachRestorationProjects', reportName: 'Monitoring for Beach Restoration Projects', canGenerate: false, isPdf: true, blankFileName: 'Beach Restoration Project Monitoring.pdf' },
  { reportId: 'NecropsyReportForm', reportName: 'Necropsy Report Form', canGenerate: false, isPdf: true, blankFileName: 'Necropsy form.pdf' },
  { reportId: 'NighttimePublicHatchlingRelease', reportName: 'Nighttime Public Hatchling Release', canGenerate: false, isPdf: true, blankFileName: 'Nighttime Public Hatchling Release form.pdf' },
  { reportId: 'ObstructedNestingAttemptForm', reportName: 'Obstructed Nesting Attempt Form', canGenerate: false, isPdf: true, blankFileName: 'Obstructed Nesting Attempt Report form.pdf' },
  { reportId: 'ObstructedNestingAttemptFormDirections', reportName: 'Obstructed Nesting Attempt Form Directions', canGenerate: false, isPdf: true, blankFileName: 'Obstructed Nesting Attempt Report form directions.pdf' },
  { reportId: 'PapillomaDocumentationForm', reportName: 'Papilloma Documentation Form', canGenerate: false, isPdf: true, blankFileName: 'Papilloma form.pdf' },
  { reportId: 'PublicTurtleWatchScheduleForm', reportName: 'Public Turtle Watch Schedule Form', canGenerate: false, isPdf: true, blankFileName: 'Public Turtle Watch Schedule form.pdf' },
  { reportId: 'PublicTurtleWatchSummaryForm', reportName: 'Public Turtle Watch Summary Form', canGenerate: false, isPdf: true, blankFileName: 'Public Turtle Watch Summary form.pdf' },
  { reportId: 'StrandingAndSalvageForm', reportName: 'Stranding and Salvage Form', canGenerate: false, isPdf: true, blankFileName: 'Stranding and Salvage form.pdf' },
  { reportId: 'TaggingDataForm', reportName: 'Tagging Data Form', canGenerate: true, isPdf: true, blankFileName: 'Tagging Data form.pdf' },
  { reportId: 'TagRequestForm', reportName: 'Tag Request Form', canGenerate: false, isPdf: true, blankFileName: 'Tag Request form.pdf' },
  { reportId: 'TurtleInjuryReport', reportName: 'Turtle Injury Report', canGenerate: true, isPdf: false },
  { reportId: 'TurtleTagReport', reportName: 'Turtle Tag Report', canGenerate: true, isPdf: false },
  { reportId: 'TurtleTransferForm', reportName: 'Turtle Transfer Form', canGenerate: false, isPdf: true, blankFileName: 'Turtle Transfer form.pdf' },
];

const ReportService = {
  
  async generateReport(reportListItem: ReportListItemModel, reportOptions: any): Promise<ReportModel> {
    
    const report = {} as ReportModel

    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.httpMethod = 'POST';
    apiRequestPayload.resource = '/reports/{reportId}';
    apiRequestPayload.pathParameters = { reportId: reportListItem.reportId };
    apiRequestPayload.body = JSON.stringify(reportOptions);
  
    const response = await ApiService.execute(apiRequestPayload);
    // console.log('ReportService::getReport::response = ', response);
    report.data = response;

    const buffer = new Buffer(response, 'base64');
    // console.log('ReportService::getReport::buffer = ', buffer);

    // const text = buffer.toString('utf8');
    // console.log('text = ', text);

    const blob = new Blob([buffer], { type: 'application/pdf' });
    // console.log('ReportService::getReport::blob = ', blob);
  
    const url = URL.createObjectURL(blob);
    // console.log('ReportService::getReport::url = ', url);
    report.url = url;
    
    return report;
  },

  getReportList(): ReportListItemModel[] {
    const listItems = new Array<ReportListItemModel>().concat(reports).filter(x => x.canGenerate);
    return listItems;
  },

  getBlankFormList(): ReportListItemModel[] {
    const listItems = new Array<ReportListItemModel>().concat(reports).filter(x => x.isPdf);
    return listItems;
  },
  
}

export default ReportService;