import LogEntryModel from 'models/LogEntryModel';
import ApiService, { ApiRequestPayload } from 'services/ApiService';
import AuthenticationService from 'services/AuthenticationService';
import { sortByPropertyDesc } from 'utils';

const RESOURCE_SINGLE = '/log-entries';
const RESOURCE_MANY = '/log-entries';

const LogEntryService = {

  async getLogEntries(): Promise<LogEntryModel[]> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_MANY;

    const response = await ApiService.getMany<LogEntryModel>(apiRequestPayload);
    response.sort(sortByPropertyDesc('entryDateTime')); 
    return response;
  },

  async saveLogEntry(message: string) {
    if (!AuthenticationService.isUserAuthenticated()) return;
    
    const logEntry = new LogEntryModel();
    logEntry.organizationId = AuthenticationService.getOrganizationId();
    logEntry.message = message;

    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { logEntryId: logEntry.logEntryId };

    await ApiService.save<LogEntryModel>(apiRequestPayload, logEntry);
  },
};

export default LogEntryService;