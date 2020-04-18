import TypeHelper from '../helpers/TypeHelper';
import OrganizationModel from '../types/OrganizationModel';

const OrganizationService = {
  getOrganization(organizationId?: string): OrganizationModel {
    return JSON.parse(localStorage.getItem('organization') || '{}');
  },
  saveOrganization(organization: OrganizationModel) {
    organization.ccHatchlingsStartingBalance = TypeHelper.toNumber(organization.ccHatchlingsStartingBalance);
    organization.cmHatchlingsStartingBalance = TypeHelper.toNumber(organization.cmHatchlingsStartingBalance);
    organization.dcHatchlingStartingBalance = TypeHelper.toNumber(organization.dcHatchlingStartingBalance);
    organization.otherHatchlingStartingBalance = TypeHelper.toNumber(organization.otherHatchlingStartingBalance);
    organization.unknownHatchlingsStartingBalance = TypeHelper.toNumber(organization.unknownHatchlingsStartingBalance);
    organization.ccWashbacksStartingBalance = TypeHelper.toNumber(organization.ccWashbacksStartingBalance);
    organization.cmWashbacksStartingBalance = TypeHelper.toNumber(organization.cmWashbacksStartingBalance);
    organization.dcWashbacksStartingBalance = TypeHelper.toNumber(organization.dcWashbacksStartingBalance);
    organization.otherWashbacksStartingBalance = TypeHelper.toNumber(organization.otherWashbacksStartingBalance);
    organization.unknownWashbacksStartingBalance = TypeHelper.toNumber(organization.unknownWashbacksStartingBalance);

    localStorage.setItem('organization', JSON.stringify(organization));
  }
};

export default OrganizationService;