import OrganizationModel from 'models/OrganizationModel';
import ApiService, { ApiRequestPayload } from 'services/ApiService';
import AuthenticationService from 'services/AuthenticationService';
import { toNumber } from 'utils';

const RESOURCE_SINGLE = '/organizations/{organizationId}';
// const RESOURCE_MANY = '/organizations';

const OrganizationService = {
  
  async getOrganization(): Promise<OrganizationModel> {
    const organizationId = AuthenticationService.getOrganizationId();

    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { organizationId: organizationId };

    const response = await ApiService.get<OrganizationModel>(apiRequestPayload);
    
    // kludge because input controls deal only with strings
    response.ccHatchlingsStartingBalance = response.ccHatchlingsStartingBalance.toString();
    response.cmHatchlingsStartingBalance = response.cmHatchlingsStartingBalance.toString();
    response.dcHatchlingsStartingBalance = response.dcHatchlingsStartingBalance.toString();
    response.otherHatchlingsStartingBalance = response.otherHatchlingsStartingBalance.toString();
    response.unknownHatchlingsStartingBalance = response.unknownHatchlingsStartingBalance.toString();
    response.ccWashbacksStartingBalance = response.ccWashbacksStartingBalance.toString();
    response.cmWashbacksStartingBalance = response.cmWashbacksStartingBalance.toString();
    response.dcWashbacksStartingBalance = response.dcWashbacksStartingBalance.toString();
    response.otherWashbacksStartingBalance = response.otherWashbacksStartingBalance.toString();
    response.unknownWashbacksStartingBalance = response.unknownWashbacksStartingBalance.toString();

    return response;
  },

  async saveOrganization(organization: OrganizationModel) {
    organization.organizationId = AuthenticationService.getOrganizationId();

    // kludge because input controls deal only with strings
    organization.ccHatchlingsStartingBalance = toNumber(organization.ccHatchlingsStartingBalance);
    organization.cmHatchlingsStartingBalance = toNumber(organization.cmHatchlingsStartingBalance);
    organization.dcHatchlingsStartingBalance = toNumber(organization.dcHatchlingsStartingBalance);
    organization.otherHatchlingsStartingBalance = toNumber(organization.otherHatchlingsStartingBalance);
    organization.unknownHatchlingsStartingBalance = toNumber(organization.unknownHatchlingsStartingBalance);
    organization.ccWashbacksStartingBalance = toNumber(organization.ccWashbacksStartingBalance);
    organization.cmWashbacksStartingBalance = toNumber(organization.cmWashbacksStartingBalance);
    organization.dcWashbacksStartingBalance = toNumber(organization.dcWashbacksStartingBalance);
    organization.otherWashbacksStartingBalance = toNumber(organization.otherWashbacksStartingBalance);
    organization.unknownWashbacksStartingBalance = toNumber(organization.unknownWashbacksStartingBalance);

    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { organizationId: AuthenticationService.getOrganizationId() };

    const response = await ApiService.save<OrganizationModel>(apiRequestPayload, organization);
    return response;
  },

}

export default OrganizationService;