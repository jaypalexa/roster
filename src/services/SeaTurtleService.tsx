import SeaTurtleModel from '../types/SeaTurtleModel';

const SeaTurtleService = {
  getSeaTurtle(seaTurtleId?: string): SeaTurtleModel {
    return JSON.parse(localStorage.getItem('seaTurtle') || '{}');
  },
  saveSeaTurtle(seaTurtle: SeaTurtleModel) {
    localStorage.setItem('seaTurtle', JSON.stringify(seaTurtle));
  },
  getSeaTurtles(organizationId: string): SeaTurtleModel[] {
    return [
      { name: 'Turtle 01', sidNumber: '01', species: 'CM' } as SeaTurtleModel,
      { name: 'Turtle 02', sidNumber: '02', species: 'EI' } as SeaTurtleModel,
      { name: 'Turtle 03', sidNumber: '03', species: 'LO' } as SeaTurtleModel,
    ];
  }
};

export default SeaTurtleService;