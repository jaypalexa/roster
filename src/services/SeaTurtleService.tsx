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
      { name: 'Turtle 04', sidNumber: '04', species: 'DC' } as SeaTurtleModel,
      { name: 'Turtle 05', sidNumber: '05', species: 'HB' } as SeaTurtleModel,
      { name: 'Turtle 06', sidNumber: '06', species: 'XX' } as SeaTurtleModel,
    ];
  }
};

export default SeaTurtleService;