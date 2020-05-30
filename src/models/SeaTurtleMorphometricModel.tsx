export default interface SeaTurtleMorphometricModel {
  [key: string]: any;
	seaTurtleMorphometricId: string;
	seaTurtleId: string;
	dateMeasured: Date;
	sclNotchNotchValue: number | string; // kludge because input controls deal only with strings
	sclNotchNotchUnits: string;
	sclNotchTipValue: number | string; // kludge because input controls deal only with strings
	sclNotchTipUnits: string;
	sclTipTipValue: number | string; // kludge because input controls deal only with strings
	sclTipTipUnits: string;
	scwValue: number | string; // kludge because input controls deal only with strings
	scwUnits: string;
	cclNotchNotchValue: number | string; // kludge because input controls deal only with strings
	cclNotchNotchUnits: string;
	cclNotchTipValue: number | string; // kludge because input controls deal only with strings
	cclNotchTipUnits: string;
	cclTipTipValue: number | string; // kludge because input controls deal only with strings
	cclTipTipUnits: string;
	ccwValue: number | string; // kludge because input controls deal only with strings
	ccwUnits: string;
	weightValue: number | string; // kludge because input controls deal only with strings
	weightUnits: string;
};
