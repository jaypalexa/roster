import TypeHelper from '../helpers/TypeHelper';
import SeaTurtleMorphometricModel from '../types/SeaTurtleMorphometricModel';

const SeaTurtleMorphometricService = {
  getSeaTurtleMorphometric(turtleMorphometricId?: string): SeaTurtleMorphometricModel {
    let seaTurtleMorphometric: SeaTurtleMorphometricModel | undefined;
    if (turtleMorphometricId) {
      const seaTurtleMorphometrics = this.getAllSeaTurtleMorphometrics();
      seaTurtleMorphometric = seaTurtleMorphometrics.find(x => x.turtleMorphometricId === turtleMorphometricId);
    }
    return seaTurtleMorphometric || {} as SeaTurtleMorphometricModel;
  },
  saveSeaTurtleMorphometric(seaTurtleMorphometric: SeaTurtleMorphometricModel) {
    seaTurtleMorphometric.sclNotchNotchValue = TypeHelper.toNumber(seaTurtleMorphometric.sclNotchNotchValue);
    seaTurtleMorphometric.sclNotchTipValue = TypeHelper.toNumber(seaTurtleMorphometric.sclNotchTipValue);
    seaTurtleMorphometric.sclTipTipValue = TypeHelper.toNumber(seaTurtleMorphometric.sclTipTipValue);
    seaTurtleMorphometric.scwValue = TypeHelper.toNumber(seaTurtleMorphometric.scwValue);
    seaTurtleMorphometric.cclNotchNotchValue = TypeHelper.toNumber(seaTurtleMorphometric.cclNotchNotchValue);
    seaTurtleMorphometric.cclNotchTipValue = TypeHelper.toNumber(seaTurtleMorphometric.cclNotchTipValue);
    seaTurtleMorphometric.cclTipTipValue = TypeHelper.toNumber(seaTurtleMorphometric.cclTipTipValue);
    seaTurtleMorphometric.ccwValue = TypeHelper.toNumber(seaTurtleMorphometric.ccwValue);
    seaTurtleMorphometric.weightValue = TypeHelper.toNumber(seaTurtleMorphometric.weightValue);

    const seaTurtleMorphometrics = this.getAllSeaTurtleMorphometrics();
    const index = seaTurtleMorphometrics.findIndex(x => x.turtleMorphometricId === seaTurtleMorphometric.turtleMorphometricId);
    if (~index) {
      seaTurtleMorphometrics[index] = {...seaTurtleMorphometric};
    } else {
      seaTurtleMorphometrics.push(seaTurtleMorphometric);
    }
    localStorage.setItem('seaTurtleMorphometrics', JSON.stringify(seaTurtleMorphometrics));
  },
  deleteSeaTurtleMorphometric(turtleMorphometricId: string) {
    const seaTurtleMorphometrics = this.getAllSeaTurtleMorphometrics();
    const index = seaTurtleMorphometrics.findIndex(x => x.turtleMorphometricId === turtleMorphometricId);
    if (~index) {
      seaTurtleMorphometrics.splice(index, 1);
    }
    localStorage.setItem('seaTurtleMorphometrics', JSON.stringify(seaTurtleMorphometrics));
  },
  getSeaTurtleMorphometricsForTurtle(turtleId?: string): SeaTurtleMorphometricModel[] {
    const allSeaTurtleMorphometrics: SeaTurtleMorphometricModel[] = JSON.parse(localStorage.getItem('seaTurtleMorphometrics') || '[]')
    const seaTurtleMorphometrics = allSeaTurtleMorphometrics.length > 0 ? allSeaTurtleMorphometrics.filter(tag => tag.turtleId === turtleId) : [];
    return seaTurtleMorphometrics;
  },
  getAllSeaTurtleMorphometrics(): SeaTurtleMorphometricModel[] {
    return JSON.parse(localStorage.getItem('seaTurtleMorphometrics') || '[]');
  }
};

export default SeaTurtleMorphometricService;