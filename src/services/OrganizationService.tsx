import OrganizationModel from '../types/OrganizationModel';

const OrganizationService = {
  getOrganization: function(): OrganizationModel {
      return JSON.parse(localStorage.getItem('organization') || '{}');
  },
  saveOrganization: function(organization: OrganizationModel): void {
    localStorage.setItem('organization', JSON.stringify(organization));
  }
};

export default OrganizationService;