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