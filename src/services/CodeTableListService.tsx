import NameValuePair from '../types/NameValuePair';

export enum CodeTableType {
  Species,
  States,
  TurtleSize,
  TurtleStatus
}

const CodeTableListService = {
  getList(codeTableType: CodeTableType, includeBlankLine: boolean): NameValuePair[] {
    let codeTableList: NameValuePair[] = [];

    if (includeBlankLine) {
      codeTableList.push({ name: '', value: '' });
    }

    switch(codeTableType) {
      case CodeTableType.Species:
        codeTableList = codeTableList.concat([
            { name: 'CC - Caretta carretta (Loggerhead)', value: 'CC' },
            { name: 'CM - Chelonia mydas (Green)', value: 'CM' },
            { name: 'DC - Dermochelys coriacea (Leatherback)', value: 'DC' },
            { name: 'EI - Eretmochelys imbricata (Hawksbill)', value: 'EI' },
            { name: 'LK - Lepidochelys kempii (Kemp\'s Ridley)', value: 'LK' },
            { name: 'LO - Lepidochelys olivacea (Olive Ridley)', value: 'LO' },
            { name: 'HB - Hybrid', value: 'HB' },
            { name: 'XX - Unknown', value: 'XX' }         
          ]);
        break;
      case CodeTableType.States:
        codeTableList = codeTableList.concat([
            { name: 'AK', value: 'AK' },
            { name: 'AL', value: 'AL' },
            { name: 'AR', value: 'AR' },
            { name: 'AZ', value: 'AZ' },
            { name: 'CA', value: 'CA' },
            { name: 'CO', value: 'CO' },
            { name: 'CT', value: 'CT' },
            { name: 'DC', value: 'DC' },
            { name: 'DE', value: 'DE' },
            { name: 'FL', value: 'FL' },
            { name: 'GA', value: 'GA' },
            { name: 'HI', value: 'HI' },
            { name: 'IA', value: 'IA' },
            { name: 'ID', value: 'ID' },
            { name: 'IL', value: 'IL' },
            { name: 'IN', value: 'IN' },
            { name: 'KS', value: 'KS' },
            { name: 'KY', value: 'KY' },
            { name: 'LA', value: 'LA' },
            { name: 'MA', value: 'MA' },
            { name: 'MD', value: 'MD' },
            { name: 'ME', value: 'ME' },
            { name: 'MI', value: 'MI' },
            { name: 'MN', value: 'MN' },
            { name: 'MO', value: 'MO' },
            { name: 'MS', value: 'MS' },
            { name: 'MT', value: 'MT' },
            { name: 'NC', value: 'NC' },
            { name: 'ND', value: 'ND' },
            { name: 'NE', value: 'NE' },
            { name: 'NH', value: 'NH' },
            { name: 'NJ', value: 'NJ' },
            { name: 'NM', value: 'NM' },
            { name: 'NV', value: 'NV' },
            { name: 'NY', value: 'NY' },
            { name: 'OH', value: 'OH' },
            { name: 'OK', value: 'OK' },
            { name: 'OR', value: 'OR' },
            { name: 'PA', value: 'PA' },
            { name: 'RI', value: 'RI' },
            { name: 'SC', value: 'SC' },
            { name: 'SD', value: 'SD' },
            { name: 'TN', value: 'TN' },
            { name: 'TX', value: 'TX' },
            { name: 'UT', value: 'UT' },
            { name: 'VA', value: 'VA' },
            { name: 'VT', value: 'VT' },
            { name: 'WA', value: 'WA' },
            { name: 'WI', value: 'WI' },
            { name: 'WV', value: 'WV' },
            { name: 'WY', value: 'WY' }
          ]);
        break;
      case CodeTableType.TurtleSize:
        codeTableList = codeTableList.concat([
            { name: 'Hatchling', value: 'Hatchling' },
            { name: 'Post-hatchling', value: 'Post-hatchling' },
            { name: 'Juvenile', value: 'Juvenile' },
            { name: 'Subadult', value: 'Subadult' },
            { name: 'Adult', value: 'Adult' },
            { name: 'Unknown', value: 'Unknown' }         
          ]);
        break;
      case CodeTableType.TurtleStatus:
        codeTableList = codeTableList.concat([
            { name: 'UR - Undergoing rehab', value: 'UR' },
            { name: 'ED - Educational display', value: 'ED' },
            { name: 'UO - Unknown origin', value: 'UO' },
            { name: 'PD - Permanently disabled', value: 'PD' },
            { name: 'PREACT - Pre-act animal', value: 'PREACT' },
            { name: 'RESEARCH (requires pre-approval)', value: 'RESEARCH' },
            { name: 'RFR - Ready for release', value: 'RFR' },
            { name: 'TSTR - Holding until reaches size', value: 'TSTR' },
            { name: 'Unknown', value: 'Unknown' }         
          ]);
        break;
    }

    return codeTableList;
  }
};

export default CodeTableListService;