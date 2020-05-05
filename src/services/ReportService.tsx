import ApiService, { ApiRequestPayload } from 'services/ApiService';
import ReportModel from 'types/ReportModel';

const ReportService = {
  
  async getReport(reportName: String): Promise<ReportModel> {
    
    const report = {} as ReportModel

    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.httpMethod = 'GET';
    apiRequestPayload.resource = '/reports/{reportName}';
    apiRequestPayload.pathParameters = { reportName: reportName };
  
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
  }
  
}

export default ReportService;