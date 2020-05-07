import ApiService, { ApiRequestPayload } from 'services/ApiService';
import AuthenticationService from 'services/AuthenticationService';
import OrganizationModel from 'types/OrganizationModel';
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

    // TODO: CACHING ???
    // ApiService.setCacheValue(`ORGANIZATION#${organization.organizationId}`, Object.assign({}, organization));
    
    return response;
  },

  async saveOrganization(organization: OrganizationModel) {
    organization.organizationId = AuthenticationService.getOrganizationId();
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

    // TODO: CACHING ???
    // ApiService.setCacheValue(`ORGANIZATION#${organization.organizationId}`, Object.assign({}, organization));

    const response = await ApiService.save<OrganizationModel>(apiRequestPayload, organization);
    return response;
  }
}

export default OrganizationService;