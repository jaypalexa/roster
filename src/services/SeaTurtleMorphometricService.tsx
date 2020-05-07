import TypeHelper from 'helpers/TypeHelper';
import ApiService, { ApiRequestPayload } from 'services/ApiService';
import SeaTurtleMorphometricModel from 'types/SeaTurtleMorphometricModel';

const RESOURCE_SINGLE = '/sea-turtles/{seaTurtleId}/sea-turtle-morphometrics/{seaTurtleMorphometricId}';
const RESOURCE_MANY = '/sea-turtles/{seaTurtleId}/sea-turtle-morphometrics';

const SeaTurtleMorphometricService = {

  async getSeaTurtleMorphometrics(seaTurtleId: string): Promise<SeaTurtleMorphometricModel[]> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_MANY;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtleId };

    const response = await ApiService.getMany<SeaTurtleMorphometricModel>(apiRequestPayload);
    response.sort((a, b) => (a.dateMeasured > b.dateMeasured) ? 1 : ((b.dateMeasured > a.dateMeasured) ? -1 : 0)); 
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
    seaTurtleMorphometric.sclNotchNotchValue = TypeHelper.toNumber(seaTurtleMorphometric.sclNotchNotchValue);
    seaTurtleMorphometric.sclNotchTipValue = TypeHelper.toNumber(seaTurtleMorphometric.sclNotchTipValue);
    seaTurtleMorphometric.sclTipTipValue = TypeHelper.toNumber(seaTurtleMorphometric.sclTipTipValue);
    seaTurtleMorphometric.scwValue = TypeHelper.toNumber(seaTurtleMorphometric.scwValue);
    seaTurtleMorphometric.cclNotchNotchValue = TypeHelper.toNumber(seaTurtleMorphometric.cclNotchNotchValue);
    seaTurtleMorphometric.cclNotchTipValue = TypeHelper.toNumber(seaTurtleMorphometric.cclNotchTipValue);
    seaTurtleMorphometric.cclTipTipValue = TypeHelper.toNumber(seaTurtleMorphometric.cclTipTipValue);
    seaTurtleMorphometric.ccwValue = TypeHelper.toNumber(seaTurtleMorphometric.ccwValue);
    seaTurtleMorphometric.weightValue = TypeHelper.toNumber(seaTurtleMorphometric.weightValue);

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