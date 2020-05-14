import SeaTurtleMorphometricModel from 'models/SeaTurtleMorphometricModel';
import ApiService, { ApiRequestPayload } from 'services/ApiService';
import { sortByProperty, toNumber } from 'utils';

const RESOURCE_SINGLE = '/sea-turtles/{seaTurtleId}/sea-turtle-morphometrics/{seaTurtleMorphometricId}';
const RESOURCE_MANY = '/sea-turtles/{seaTurtleId}/sea-turtle-morphometrics';

const SeaTurtleMorphometricService = {

  async getSeaTurtleMorphometrics(seaTurtleId: string): Promise<SeaTurtleMorphometricModel[]> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_MANY;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtleId };

    const response = await ApiService.getMany<SeaTurtleMorphometricModel>(apiRequestPayload);
    response.sort(sortByProperty('dateMeasured')); 
    return response;
  },

  async getSeaTurtleMorphometric(seaTurtleId: string, seaTurtleMorphometricId: string): Promise<SeaTurtleMorphometricModel> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtleId, seaTurtleMorphometricId: seaTurtleMorphometricId };

    const response = await ApiService.get<SeaTurtleMorphometricModel>(apiRequestPayload);
    return response;
  },


  async saveSeaTurtleMorphometric(seaTurtleMorphometric: SeaTurtleMorphometricModel) {
    seaTurtleMorphometric.sclNotchNotchValue = toNumber(seaTurtleMorphometric.sclNotchNotchValue);
    seaTurtleMorphometric.sclNotchTipValue = toNumber(seaTurtleMorphometric.sclNotchTipValue);
    seaTurtleMorphometric.sclTipTipValue = toNumber(seaTurtleMorphometric.sclTipTipValue);
    seaTurtleMorphometric.scwValue = toNumber(seaTurtleMorphometric.scwValue);
    seaTurtleMorphometric.cclNotchNotchValue = toNumber(seaTurtleMorphometric.cclNotchNotchValue);
    seaTurtleMorphometric.cclNotchTipValue = toNumber(seaTurtleMorphometric.cclNotchTipValue);
    seaTurtleMorphometric.cclTipTipValue = toNumber(seaTurtleMorphometric.cclTipTipValue);
    seaTurtleMorphometric.ccwValue = toNumber(seaTurtleMorphometric.ccwValue);
    seaTurtleMorphometric.weightValue = toNumber(seaTurtleMorphometric.weightValue);

    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtleMorphometric.seaTurtleId, seaTurtleMorphometricId: seaTurtleMorphometric.seaTurtleMorphometricId };

    await ApiService.save<SeaTurtleMorphometricModel>(apiRequestPayload, seaTurtleMorphometric);
  },

  async deleteSeaTurtleMorphometric(seaTurtleId: string, seaTurtleMorphometricId: string) {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtleId, seaTurtleMorphometricId: seaTurtleMorphometricId };

    const response = await ApiService.delete(apiRequestPayload);
    return response;
  },

};

export default SeaTurtleMorphometricService;