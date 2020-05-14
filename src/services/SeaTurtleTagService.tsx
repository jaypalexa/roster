import SeaTurtleTagModel from 'models/SeaTurtleTagModel';
import ApiService, { ApiRequestPayload } from 'services/ApiService';

const RESOURCE_SINGLE = '/sea-turtles/{seaTurtleId}/sea-turtle-tags/{seaTurtleTagId}';
const RESOURCE_MANY = '/sea-turtles/{seaTurtleId}/sea-turtle-tags';

const SeaTurtleTagService = {

  async getSeaTurtleTags(seaTurtleId: string): Promise<SeaTurtleTagModel[]> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_MANY;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtleId };

    const response = await ApiService.getMany<SeaTurtleTagModel>(apiRequestPayload);
    return response;
  },

  async getSeaTurtleTag(seaTurtleId: string, seaTurtleTagId: string): Promise<SeaTurtleTagModel> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtleId, seaTurtleTagId: seaTurtleTagId };

    const response = await ApiService.get<SeaTurtleTagModel>(apiRequestPayload);
    return response;
  },

  async saveSeaTurtleTag(seaTurtleTag: SeaTurtleTagModel) {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtleTag.seaTurtleId, seaTurtleTagId: seaTurtleTag.seaTurtleTagId };

    await ApiService.save<SeaTurtleTagModel>(apiRequestPayload, seaTurtleTag);
  },

  async deleteSeaTurtleTag(seaTurtleId: string, seaTurtleTagId: string) {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtleId, seaTurtleTagId: seaTurtleTagId };

    const response = await ApiService.delete(apiRequestPayload);
    return response;
  },

};

export default SeaTurtleTagService;