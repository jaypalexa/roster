import HoldingTankModel from 'models/HoldingTankModel';
import ApiService, { ApiRequestPayload } from 'services/ApiService';
import AuthenticationService from 'services/AuthenticationService';

const RESOURCE_SINGLE = '/holding-tanks/{holdingTankId}';
const RESOURCE_MANY = '/holding-tanks';

const HoldingTankService = {

  async getHoldingTanks(): Promise<HoldingTankModel[]> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_MANY;

    const response = await ApiService.getMany<HoldingTankModel>(apiRequestPayload);
    return response;
  },

  async getHoldingTank(holdingTankId: string): Promise<HoldingTankModel> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { holdingTankId: holdingTankId };

    const response = await ApiService.get<HoldingTankModel>(apiRequestPayload);
    return response;
  },

  async saveHoldingTank(holdingTank: HoldingTankModel) {
    holdingTank.organizationId = AuthenticationService.getOrganizationId();

    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { holdingTankId: holdingTank.holdingTankId };

    await ApiService.save<HoldingTankModel>(apiRequestPayload, holdingTank);
  },

  async deleteHoldingTank(holdingTankId: string) {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { holdingTankId: holdingTankId };

    const response = await ApiService.delete(apiRequestPayload);
    return response;
  },
};

export default HoldingTankService;