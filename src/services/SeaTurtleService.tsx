import SeaTurtleModel from '../types/SeaTurtleModel';

const SeaTurtleService = {
  getSeaTurtle(turtleId?: string): SeaTurtleModel {
    let seaTurtle: SeaTurtleModel | undefined;
    if (turtleId) {
      const seaTurtles = this.getSeaTurtles('');
      seaTurtle = seaTurtles.find(x => x.turtleId === turtleId);
    }
    return seaTurtle || {} as SeaTurtleModel;
  },
  saveSeaTurtle(seaTurtle: SeaTurtleModel) {
    const seaTurtles = this.getSeaTurtles('');
    const index = seaTurtles.findIndex(x => x.turtleId === seaTurtle.turtleId);
    if (~index) {
      seaTurtles[index] = {...seaTurtle};
    } else {
      seaTurtles.push(seaTurtle);
    }
    localStorage.setItem('seaTurtles', JSON.stringify(seaTurtles));
  },
  deleteSeaTurtle(turtleId: string) {
    const seaTurtles = this.getSeaTurtles('');
    const index = seaTurtles.findIndex(x => x.turtleId === turtleId);
    if (~index) {
      seaTurtles.splice(index, 1);
    }
    localStorage.setItem('seaTurtles', JSON.stringify(seaTurtles));
  },
  getSeaTurtles(organizationId: string): SeaTurtleModel[] {
    return JSON.parse(localStorage.getItem('seaTurtles') || '[]');
  }
};

export default SeaTurtleService;