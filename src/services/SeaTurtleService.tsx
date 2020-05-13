import ApiService, { ApiRequestPayload } from 'services/ApiService';
import AuthenticationService from 'services/AuthenticationService';
import NameValuePair from 'types/NameValuePair';
import SeaTurtleModel from 'types/SeaTurtleModel';
import { sortByProperty } from 'utils';

const RESOURCE_SINGLE = '/sea-turtles/{seaTurtleId}';
const RESOURCE_MANY = '/sea-turtles';

const SeaTurtleService = {

  async getSeaTurtles(): Promise<SeaTurtleModel[]> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_MANY;

    const response = await ApiService.getMany<SeaTurtleModel>(apiRequestPayload);
    return response;
  },

  async getSeaTurtle(seaTurtleId: string): Promise<SeaTurtleModel> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtleId };

    const response = await ApiService.get<SeaTurtleModel>(apiRequestPayload);
    return response;
  },

  async saveSeaTurtle(seaTurtle: SeaTurtleModel) {
    seaTurtle.organizationId = AuthenticationService.getOrganizationId();

    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtle.seaTurtleId };

    await ApiService.save<SeaTurtleModel>(apiRequestPayload, seaTurtle);
  },

  async deleteSeaTurtle(seaTurtleId: string) {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_SINGLE;
    apiRequestPayload.pathParameters = { seaTurtleId: seaTurtleId };

    const response = await ApiService.delete(apiRequestPayload);
    return response;
  },

  async getSeaTurtleListItems(): Promise<NameValuePair[]> {
    const seaTurtles = await this.getSeaTurtles();
    const seaTurtleListItems = seaTurtles.map(x => ({value: x.seaTurtleId, name: x.seaTurtleName}));
    seaTurtleListItems.sort(sortByProperty('name')); 

    return seaTurtleListItems;
  },
};

export default SeaTurtleService;