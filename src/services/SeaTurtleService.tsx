import NameValuePair from 'models/NameValuePair';
import SeaTurtleListItemModel from 'models/SeaTurtleListItemModel';
import SeaTurtleModel from 'models/SeaTurtleModel';
import ApiService, { ApiRequestPayload } from 'services/ApiService';
import AuthenticationService from 'services/AuthenticationService';
import { sortByProperty } from 'utils';

const RESOURCE_SINGLE = '/sea-turtles/{seaTurtleId}';
const RESOURCE_MANY = '/sea-turtles';
const RESOURCE_MANY_LIST_ITEMS = '/sea-turtle-list-items';

const SeaTurtleService = {

  async getSeaTurtleListItems(): Promise<NameValuePair[]> {
    const seaTurtles = await this.getSeaTurtles();
    const seaTurtleListItems = seaTurtles.map(x => ({value: x.seaTurtleId, name: x.seaTurtleName}));
    seaTurtleListItems.sort(sortByProperty('name')); 

    return seaTurtleListItems;
  },

  async getSeaTurtleListItemsForTable(): Promise<SeaTurtleListItemModel[]> {
    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = RESOURCE_MANY_LIST_ITEMS;

    const response = await ApiService.getMany<SeaTurtleModel>(apiRequestPayload);
    return response;
  },

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
};

export default SeaTurtleService;