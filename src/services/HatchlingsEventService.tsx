import HatchlingsEventModel from 'models/HatchlingsEventModel';
import ApiService, { ApiRequestPayload } from 'services/ApiService';
import AuthenticationService from 'services/AuthenticationService';
import { sortByProperty, toNumber } from 'utils';

const RESOURCE_SINGLE = '/hatchlings-events/{hatchlingsEventId}';
const RESOURCE_MANY = '/hatchlings-events';

const HatchlingsEventService = {

  async getHatchlingsEvents(): Promise<HatchlingsEventModel[]> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_MANY;

    const response = await ApiService.getMany<HatchlingsEventModel>(apiRequestPayload);
    response.sort(sortByProperty('eventDate')); 
    return response;
  },

  async getHatchlingsEvent(hatchlingsEventId: string): Promise<HatchlingsEventModel> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { hatchlingsEventId: hatchlingsEventId };

    const response = await ApiService.get<HatchlingsEventModel>(apiRequestPayload);
    
    // kludge because input controls deal only with strings
    if (response.eventType === 'Released') {
      response.beachEventCount = response.beachEventCount.toString();
      response.offshoreEventCount = response.offshoreEventCount.toString();
    } else {
      response.eventCount = response.eventCount.toString();
    }

    return response;
  },

  async saveHatchlingsEvent(hatchlingsEvent: HatchlingsEventModel) {
    hatchlingsEvent.organizationId = AuthenticationService.getOrganizationId();

    // kludge because input controls deal only with strings
    if (hatchlingsEvent.eventType === 'Released') {
      hatchlingsEvent.beachEventCount = toNumber(hatchlingsEvent.beachEventCount);
      hatchlingsEvent.offshoreEventCount = toNumber(hatchlingsEvent.offshoreEventCount);
    } else {
      hatchlingsEvent.eventCount = toNumber(hatchlingsEvent.eventCount);
    }

    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { hatchlingsEventId: hatchlingsEvent.hatchlingsEventId };

    await ApiService.save<HatchlingsEventModel>(apiRequestPayload, hatchlingsEvent);
  },

  async deleteHatchlingsEvent(hatchlingsEventId: string) {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { hatchlingsEventId: hatchlingsEventId };

    const response = await ApiService.delete(apiRequestPayload);
    return response;
  },
};

export default HatchlingsEventService;