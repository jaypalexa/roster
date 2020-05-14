import HoldingTankMeasurementModel from 'models/HoldingTankMeasurementModel';
import ApiService, { ApiRequestPayload } from 'services/ApiService';
import { sortByProperty, toNumber } from 'utils';

const RESOURCE_SINGLE = '/holding-tanks/{holdingTankId}/holding-tank-measurements/{holdingTankMeasurementId}';
const RESOURCE_MANY = '/holding-tanks/{holdingTankId}/holding-tank-measurements';

const HoldingTankMeasurementService = {

  async getHoldingTankMeasurements(holdingTankId: string): Promise<HoldingTankMeasurementModel[]> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_MANY;
    apiRequestPayload.pathParameters = { holdingTankId: holdingTankId };

    const response = await ApiService.getMany<HoldingTankMeasurementModel>(apiRequestPayload);
    response.sort(sortByProperty('dateMeasured')); 
    return response;
  },

  async getHoldingTankMeasurement(holdingTankId: string, holdingTankMeasurementId: string): Promise<HoldingTankMeasurementModel> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { holdingTankId: holdingTankId, holdingTankMeasurementId: holdingTankMeasurementId };

    const response = await ApiService.get<HoldingTankMeasurementModel>(apiRequestPayload);
    return response;
  },

  async saveHoldingTankMeasurement(holdingTankMeasurement: HoldingTankMeasurementModel) {
    holdingTankMeasurement.temperature = toNumber(holdingTankMeasurement.temperature);
    holdingTankMeasurement.salinity = toNumber(holdingTankMeasurement.salinity);
    holdingTankMeasurement.ph = toNumber(holdingTankMeasurement.ph);

    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { holdingTankId: holdingTankMeasurement.holdingTankId, holdingTankMeasurementId: holdingTankMeasurement.holdingTankMeasurementId };

    await ApiService.save<HoldingTankMeasurementModel>(apiRequestPayload, holdingTankMeasurement);
  },

  async deleteHoldingTankMeasurement(holdingTankId: string, holdingTankMeasurementId: string) {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { holdingTankId: holdingTankId, holdingTankMeasurementId: holdingTankMeasurementId };

    const response = await ApiService.delete(apiRequestPayload);
    return response;
  },

};

export default HoldingTankMeasurementService;