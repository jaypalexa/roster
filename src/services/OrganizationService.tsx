import TypeHelper from 'helpers/TypeHelper';
import auth from 'hooks/UseAuthentication';
import ApiService, { ApiRequestPayload } from 'services/ApiService';
import OrganizationModel from 'types/OrganizationModel';

const OrganizationService = {
  
  async getOrganization(): Promise<OrganizationModel> {
    const organizationId = auth().getTokenOrganizationId;

    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.httpMethod = 'GET';
    apiRequestPayload.resource = '/organizations/{organizationId}';
    apiRequestPayload.pathParameters = { organizationId: organizationId };

    const response = await ApiService.execute(apiRequestPayload);
    console.log('getOrganization::response', response);
    
    const organization = response as OrganizationModel
    // TODO: CACHING ???
    // ApiService.setCacheValue(`ORGANIZATION#${organization.organizationId}`, Object.assign({}, organization));
    
    return organization;
  },

  async saveOrganization(organization: OrganizationModel) {
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
    apiRequestPayload.httpMethod = 'PUT';
    apiRequestPayload.resource = '/organizations/{organizationId}';
    apiRequestPayload.pathParameters = { organizationId: auth().getTokenOrganizationId };
    apiRequestPayload.body = JSON.stringify(organization);

    // TODO: CACHING ???
    // ApiService.setCacheValue(`ORGANIZATION#${organization.organizationId}`, Object.assign({}, organization));

    const response = await ApiService.execute(apiRequestPayload);
    console.log('saveOrganization::response', response);
  }
}

export default OrganizationService;