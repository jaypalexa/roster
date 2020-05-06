import ApiService, { ApiRequestPayload } from 'services/ApiService';
import SeaTurtleModel from '../types/SeaTurtleModel';

const RESOURCE_SINGLE = '/sea-turtles/{seaTurtleId}';
const RESOURCE_MANY = '/sea-turtles';

const SeaTurtleService = {

  async getSeaTurtles(): Promise<SeaTurtleModel[]> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_MANY;

    const seaTurtles = await ApiService.getMany<SeaTurtleModel>(apiRequestPayload);
    return seaTurtles;
  },

  async getSeaTurtle(seaTurtleId: string): Promise<SeaTurtleModel> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtleId };

    const seaTurtle = await ApiService.get<SeaTurtleModel>(apiRequestPayload);
    return seaTurtle;
  },

  async saveSeaTurtle(seaTurtle: SeaTurtleModel) {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtle.seaTurtleId };

    await ApiService.save<SeaTurtleModel>(apiRequestPayload, seaTurtle);
  },

  async deleteSeaTurtle(seaTurtleId: string) {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtleId };

    const seaTurtle = await ApiService.delete(apiRequestPayload);
    return seaTurtle;
  },
};

export default SeaTurtleService;