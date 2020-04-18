import TypeHelper from '../helpers/TypeHelper';
import OrganizationModel from '../types/OrganizationModel';

const OrganizationService = {
  getOrganization(organizationId?: string): OrganizationModel {
    return JSON.parse(localStorage.getItem('organization') || '{}');
  },
  saveOrganization(organization: OrganizationModel) {
    organization.ccHatchlingStartingBalance = TypeHelper.toNumber(organization.ccHatchlingStartingBalance);
    organization.cmHatchlingStartingBalance = TypeHelper.toNumber(organization.cmHatchlingStartingBalance);
    organization.dcHatchlingStartingBalance = TypeHelper.toNumber(organization.dcHatchlingStartingBalance);
    organization.otherHatchlingStartingBalance = TypeHelper.toNumber(organization.otherHatchlingStartingBalance);
    organization.unknownHatchlingStartingBalance = TypeHelper.toNumber(organization.unknownHatchlingStartingBalance);
    organization.ccWashbackStartingBalance = TypeHelper.toNumber(organization.ccWashbackStartingBalance);
    organization.cmWashbackStartingBalance = TypeHelper.toNumber(organization.cmWashbackStartingBalance);
    organization.dcWashbackStartingBalance = TypeHelper.toNumber(organization.dcWashbackStartingBalance);
    organization.otherWashbackStartingBalance = TypeHelper.toNumber(organization.otherWashbackStartingBalance);
    organization.unknownWashbackStartingBalance = TypeHelper.toNumber(organization.unknownWashbackStartingBalance);

    localStorage.setItem('organization', JSON.stringify(organization));
  }
};

export default OrganizationService;