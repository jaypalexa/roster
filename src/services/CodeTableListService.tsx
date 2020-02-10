import NameValuePair from '../types/NameValuePair';

export enum CodeTableType {
  County,
  Species,
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
      case CodeTableType.County:
        codeTableList = codeTableList.concat([
            { name: 'Alachua', value: 'Alachua' },
            { name: 'Baker', value: 'Baker' },
            { name: 'Bay', value: 'Bay' },
            { name: 'Bradford', value: 'Bradford' },
            { name: 'Brevard', value: 'Brevard' },
            { name: 'Broward', value: 'Broward' },
            { name: 'Calhoun', value: 'Calhoun' },
            { name: 'Charlotte', value: 'Charlotte' },
            { name: 'Citrus', value: 'Citrus' },
            { name: 'Clay', value: 'Clay' },
            { name: 'Collier', value: 'Collier' },
            { name: 'Columbia', value: 'Columbia' },
            { name: 'DeSoto', value: 'DeSoto' },
            { name: 'Dixie', value: 'Dixie' },
            { name: 'Duval', value: 'Duval' },
            { name: 'Escambia', value: 'Escambia' },
            { name: 'Flagler', value: 'Flagler' },
            { name: 'Franklin', value: 'Franklin' },
            { name: 'Gadsden', value: 'Gadsden' },
            { name: 'Gilchrist', value: 'Gilchrist' },
            { name: 'Glades', value: 'Glades' },
            { name: 'Gulf', value: 'Gulf' },
            { name: 'Hamilton', value: 'Hamilton' },
            { name: 'Hardee', value: 'Hardee' },
            { name: 'Hendry', value: 'Hendry' },
            { name: 'Hernando', value: 'Hernando' },
            { name: 'Highlands', value: 'Highlands' },
            { name: 'Hillsborough', value: 'Hillsborough' },
            { name: 'Holmes', value: 'Holmes' },
            { name: 'Indian River', value: 'Indian River' },
            { name: 'Jackson', value: 'Jackson' },
            { name: 'Jefferson', value: 'Jefferson' },
            { name: 'Lafayette', value: 'Lafayette' },
            { name: 'Lake', value: 'Lake' },
            { name: 'Lee', value: 'Lee' },
            { name: 'Leon', value: 'Leon' },
            { name: 'Levy', value: 'Levy' },
            { name: 'Liberty', value: 'Liberty' },
            { name: 'Madison', value: 'Madison' },
            { name: 'Manatee', value: 'Manatee' },
            { name: 'Marion', value: 'Marion' },
            { name: 'Martin', value: 'Martin' },
            { name: 'Miami-Dade', value: 'Miami-Dade' },
            { name: 'Monroe', value: 'Monroe' },
            { name: 'Nassau', value: 'Nassau' },
            { name: 'Okaloosa', value: 'Okaloosa' },
            { name: 'Okeechobee', value: 'Okeechobee' },
            { name: 'Orange', value: 'Orange' },
            { name: 'Osceola', value: 'Osceola' },
            { name: 'Palm Beach', value: 'Palm Beach' },
            { name: 'Pasco', value: 'Pasco' },
            { name: 'Pinellas', value: 'Pinellas' },
            { name: 'Polk', value: 'Polk' },
            { name: 'Putnam', value: 'Putnam' },
            { name: 'St. Johns', value: 'St. Johns' },
            { name: 'St. Lucie', value: 'St. Lucie' },
            { name: 'Santa Rosa', value: 'Santa Rosa' },
            { name: 'Sarasota', value: 'Sarasota' },
            { name: 'Seminole', value: 'Seminole' },
            { name: 'Sumter', value: 'Sumter' },
            { name: 'Suwannee', value: 'Suwannee' },
            { name: 'Taylor', value: 'Taylor' },
            { name: 'Union', value: 'Union' },
            { name: 'Volusia', value: 'Volusia' },
            { name: 'Wakulla', value: 'Wakulla' },
            { name: 'Walton', value: 'Walton' },
            { name: 'Washington', value: 'Washington' }
          ]);
        break;
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