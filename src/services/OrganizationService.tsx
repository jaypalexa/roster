import TypeHelper from 'helpers/TypeHelper';
import ApiService, { ApiRequestPayload } from 'services/ApiService';
import AuthenticationService from 'services/AuthenticationService';
import OrganizationModel from 'types/OrganizationModel';

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
    organization.ccHatchlingsStartingBalance = TypeHelper.toNumber(organization.ccHatchlingsStartingBalance);
    organization.cmHatchlingsStartingBalance = TypeHelper.toNumber(organization.cmHatchlingsStartingBalance);
    organization.dcHatchlingsStartingBalance = TypeHelper.toNumber(organization.dcHatchlingsStartingBalance);
    organization.otherHatchlingsStartingBalance = TypeHelper.toNumber(organization.otherHatchlingsStartingBalance);
    organization.unknownHatchlingsStartingBalance = TypeHelper.toNumber(organization.unknownHatchlingsStartingBalance);
    organization.ccWashbacksStartingBalance = TypeHelper.toNumber(organization.ccWashbacksStartingBalance);
    organization.cmWashbacksStartingBalance = TypeHelper.toNumber(organization.cmWashbacksStartingBalance);
    organization.dcWashbacksStartingBalance = TypeHelper.toNumber(organization.dcWashbacksStartingBalance);
    organization.otherWashbacksStartingBalance = TypeHelper.toNumber(organization.otherWashbacksStartingBalance);
    organization.unknownWashbacksStartingBalance = TypeHelper.toNumber(organization.unknownWashbacksStartingBalance);

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