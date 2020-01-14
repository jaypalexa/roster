import OrganizationModel from '../types/OrganizationModel';

const OrganizationService = {
  getOrganization(): OrganizationModel {
    return JSON.parse(localStorage.getItem('organization') || '{}');
  },
  saveOrganization(organization: OrganizationModel) {
    localStorage.setItem('organization', JSON.stringify(organization));
  }
};

export default OrganizationService;