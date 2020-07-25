import HomeSummaryModel from 'models/HomeSummaryModel';
import ApiService, { ApiRequestPayload } from 'services/ApiService';

const RESOURCE_SINGLE = '/home-summary';

const HomeSummaryService = {
  
  async getHomeSummary(): Promise<HomeSummaryModel> {
    const cachedValue = ApiService.getCacheValue(RESOURCE_SINGLE) as HomeSummaryModel;
    const needDataRefresh = await ApiService.needDataRefresh();

    if (!cachedValue || needDataRefresh) {
      const apiRequestPayload = {} as ApiRequestPayload;
      apiRequestPayload.resource = RESOURCE_SINGLE;
      const response = await ApiService.get<HomeSummaryModel>(apiRequestPayload);
      ApiService.setCacheValue(RESOURCE_SINGLE, {...response});
      return response;
    }
    else {
      return cachedValue;
    }
  },

}

export default HomeSummaryService;