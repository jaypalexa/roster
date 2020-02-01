import SeaTurtleModel from '../types/SeaTurtleModel';

const SeaTurtleService = {
  getSeaTurtle(seaTurtleId?: string): SeaTurtleModel {
    return JSON.parse(localStorage.getItem('seaTurtle') || '{}');
  },
  saveSeaTurtle(seaTurtle: SeaTurtleModel) {
    localStorage.setItem('seaTurtle', JSON.stringify(seaTurtle));
  }
};

export default SeaTurtleService;