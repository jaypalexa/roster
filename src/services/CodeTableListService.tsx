import NameValuePair from '../types/NameValuePair';

// VALUE is the "key"
// NAME is the display value

export enum CodeTableType {
  BurialLocation,
  CaptureProjectType,
  CmIn,
  County,
  Disposition,
  Flipper,
  InitialCondition,
  HowWasSexDetermined,
  KgLb,
  PartsSalvagedType,
  PreferredUnitsType,
  RecaptureType,
  Sex,
  Species,
  StateCoordinatorNotified,
  StrandingLocationShore,
  TagLocation,
  TagType,
  TurtleSize,
  TurtleStatus,
  WeightAccuracyType,
  YesNoUndetermined
}

const CodeTableListService = {
  getList(codeTableType: CodeTableType, includeBlankLine: boolean): NameValuePair[] {
    let codeTableList: NameValuePair[] = [];

    if (includeBlankLine) {
      codeTableList.push({ name: '', value: '' });
    }

    switch(codeTableType) {
      case CodeTableType.BurialLocation:
        codeTableList = codeTableList.concat([
          { name: 'N - On Beach', value: 'N' },
          { name: 'F - Off Beach', value: 'F' }
        ]);
        break;
      case CodeTableType.CaptureProjectType:
        codeTableList = codeTableList.concat([
          { name: 'N - Nesting beach', value: 'N' },
          { name: 'T - Tangle net', value: 'T' },
          { name: 'P - Pound net', value: 'P' },
          { name: 'H - Hand catch', value: 'H' },
          { name: 'S - Stranding', value: 'S' },
          { name: 'O - Other', value: 'O' } 
        ]);
        break;
      case CodeTableType.CmIn:
        codeTableList = codeTableList.concat([
          { name: 'cm', value: 'cm' },
          { name: 'in', value: 'in' }
        ]);
        break;
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
      case CodeTableType.Disposition:
        codeTableList = codeTableList.concat([
          { name: '1 - Left On Beach Where Found', value: '1' },
          { name: '2 - Buried', value: '2' },
          { name: '3 - Salvaged', value: '3' },
          { name: '4 - Pulled Up On Beach/Dune', value: '4' },
          { name: '6 - Alive, Released', value: '6' },
          { name: '7 - Alive, Taken To Rehab Facility', value: '7' },
          { name: '8 - Left Floating, Not Recovered', value: '8' },
          { name: '9 - Disposition Unknown', value: '9' }
        ]);
        break;
      case CodeTableType.Flipper:
        codeTableList = codeTableList.concat([
          { name: 'LFF - Left Front Flipper', value: 'LFF' },
          { name: 'LRF - Left Rear Flipper', value: 'LRF' },
          { name: 'RFF - Right Front Flipper', value: 'RFF' },
          { name: 'RRF - Right Rear Flipper', value: 'RRF' } 
        ]);
        break;
      case CodeTableType.HowWasSexDetermined:
        codeTableList = codeTableList.concat([
          { name: 'N - Necropsy', value: 'N' },
          { name: 'T - Tail Length (adult only)', value: 'T' }
        ]);
        break;
      case CodeTableType.InitialCondition:
        codeTableList = codeTableList.concat([
          { name: '0 - Alive', value: '0' },
          { name: '1 - Fresh Dead', value: '1' },
          { name: '2 - Moderately Decomposed', value: '2' },
          { name: '3 - Severely Decomposed', value: '3' },
          { name: '4 - Dried Carcass', value: '4' },
          { name: '5 - Skeleton, Bones Only', value: '5' }
        ]);
        break;
      case CodeTableType.KgLb:
        codeTableList = codeTableList.concat([
          { name: 'kg', value: 'kg' },
          { name: 'lb', value: 'lb' }
        ]);
        break;
      case CodeTableType.PartsSalvagedType:
        codeTableList = codeTableList.concat([
          { name: 'A - All', value: 'A' },
          { name: 'P - Part(s)', value: 'P' }
        ]);
        break;
      case CodeTableType.PreferredUnitsType:
        codeTableList = codeTableList.concat([
          { name: 'M - Metric', value: 'M' },
          { name: 'I - Imperial', value: 'I' } 
        ]);
        break;
      case CodeTableType.RecaptureType:
        codeTableList = codeTableList.concat([
          { name: 'S - Recapture of same project turtle', value: 'S' },
          { name: 'D - Recapture of different project turtle', value: 'D' } 
        ]);
        break;
      case CodeTableType.Sex:
        codeTableList = codeTableList.concat([
          { name: 'F - Female', value: 'F' },
          { name: 'M - Male', value: 'M' },
          { name: 'U - Undetermined', value: 'U' }
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
      case CodeTableType.StateCoordinatorNotified:
        codeTableList = codeTableList.concat([
          { name: 'X - Not Notified', value: 'X' },
          { name: 'P - Phone', value: 'P' },
          { name: 'F - Fax', value: 'F' },
          { name: 'E - E-mail', value: 'E' }
        ]);
        break;
      case CodeTableType.StrandingLocationShore:
        codeTableList = codeTableList.concat([
          { name: 'O - Offshore (Atlantic or Gulf beach)', value: 'O' },
          { name: 'I - Inshore (bay, river, sound, inlet, etc.)', value: 'I' }
        ]);
        break;
      case CodeTableType.TagLocation:
        codeTableList = codeTableList.concat([
          { name: 'RFF', value: 'RFF' },
          { name: 'LFF', value: 'LFF' },
          { name: 'RRF', value: 'RRF' },
          { name: 'LRF', value: 'LRF' },
          { name: 'Other', value: 'Other' }         
        ]);
        break;
      case CodeTableType.TagType:
        codeTableList = codeTableList.concat([
          { name: 'Inconel', value: 'Inconel' },
          { name: 'Monel', value: 'Monel' },
          { name: 'PIT', value: 'PIT' },
          { name: 'Roto', value: 'Roto' },
          { name: 'Other', value: 'Other' }         
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
      case CodeTableType.WeightAccuracyType:
        codeTableList = codeTableList.concat([
          { name: 'A - Actual', value: 'A' },
          { name: 'E - Estimated', value: 'E' }
        ]);
        break;
      case CodeTableType.YesNoUndetermined:
        codeTableList = codeTableList.concat([
          { name: 'Y - Yes', value: 'Y' },
          { name: 'N - No', value: 'N' },
          { name: 'U - Undetermined', value: 'U' }
        ]);
        break;
    }

    return codeTableList;
  }
};

export default CodeTableListService;