import WashbacksEventModel from 'models/WashbacksEventModel';
import ApiService, { ApiRequestPayload } from 'services/ApiService';
import AuthenticationService from 'services/AuthenticationService';
import { sortByProperty, toNumber } from 'utils';

const RESOURCE_SINGLE = '/washbacks-events/{washbacksEventId}';
const RESOURCE_MANY = '/washbacks-events';

const WashbacksEventService = {

  async getWashbacksEvents(): Promise<WashbacksEventModel[]> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_MANY;

    const response = await ApiService.getMany<WashbacksEventModel>(apiRequestPayload);
    response.sort(sortByProperty('eventDate')); 
    return response;
  },

  async getWashbacksEvent(washbacksEventId: string): Promise<WashbacksEventModel> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { washbacksEventId: washbacksEventId };

    const response = await ApiService.get<WashbacksEventModel>(apiRequestPayload);
    
    // kludge because input controls deal only with strings
    if (response.eventType === 'Released') {
      response.beachEventCount = response.beachEventCount.toString();
      response.offshoreEventCount = response.offshoreEventCount.toString();
    } else {
      response.eventCount = response.eventCount.toString();
    }

    return response;
  },

  async saveWashbacksEvent(washbacksEvent: WashbacksEventModel) {
    washbacksEvent.organizationId = AuthenticationService.getOrganizationId();

    if (washbacksEvent.eventType === 'Released') {
      washbacksEvent.beachEventCount = toNumber(washbacksEvent.beachEventCount);
      washbacksEvent.offshoreEventCount = toNumber(washbacksEvent.offshoreEventCount);
    } else {
      washbacksEvent.eventCount = toNumber(washbacksEvent.eventCount);
    }

    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { washbacksEventId: washbacksEvent.washbacksEventId };

    await ApiService.save<WashbacksEventModel>(apiRequestPayload, washbacksEvent);
  },

  async deleteWashbacksEvent(washbacksEventId: string) {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { washbacksEventId: washbacksEventId };

    const response = await ApiService.delete(apiRequestPayload);
    return response;
  },
};

export default WashbacksEventService;