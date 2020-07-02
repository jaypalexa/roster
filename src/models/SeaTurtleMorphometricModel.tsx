export default class SeaTurtleMorphometricModel {
  [key: string]: any;
	seaTurtleMorphometricId!: string;
	seaTurtleId!: string;
	dateMeasured?: string;
	sclNotchNotchValue!: number | string; // kludge because input controls deal only with strings
	sclNotchNotchUnits!: string;
	sclNotchTipValue!: number | string; // kludge because input controls deal only with strings
	sclNotchTipUnits!: string;
	sclTipTipValue!: number | string; // kludge because input controls deal only with strings
	sclTipTipUnits!: string;
	scwValue!: number | string; // kludge because input controls deal only with strings
	scwUnits!: string;
	cclNotchNotchValue!: number | string; // kludge because input controls deal only with strings
	cclNotchNotchUnits!: string;
	cclNotchTipValue!: number | string; // kludge because input controls deal only with strings
	cclNotchTipUnits!: string;
	cclTipTipValue!: number | string; // kludge because input controls deal only with strings
	cclTipTipUnits!: string;
	ccwValue!: number | string; // kludge because input controls deal only with strings
	ccwUnits!: string;
	weightValue!: number | string; // kludge because input controls deal only with strings
	weightUnits!: string;

  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
		// strings for list items:  need to be initialized to empty string to clear listbox (input select)
		this.sclNotchNotchUnits = '';
		this.sclNotchTipUnits = '';
		this.sclTipTipUnits = '';
		this.scwUnits = '';
		this.cclNotchNotchUnits = '';
		this.cclNotchTipUnits = '';
		this.cclTipTipUnits = '';
		this.ccwUnits = '';
		this.weightUnits = '';
	}
};
