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
      { turtleName: 'Turtle 01', sidNumber: '01', strandingIdNumber: '101', species: 'CM' } as SeaTurtleModel,
      { turtleName: 'Turtle 02', sidNumber: '02', strandingIdNumber: '102', species: 'EI' } as SeaTurtleModel,
      { turtleName: 'Turtle 03', sidNumber: '03', strandingIdNumber: '103', species: 'LO' } as SeaTurtleModel,
      { turtleName: 'Turtle 04', sidNumber: '04', strandingIdNumber: '104', species: 'DC' } as SeaTurtleModel,
      { turtleName: 'Turtle 05', sidNumber: '05', strandingIdNumber: '105', species: 'HB' } as SeaTurtleModel,
      { turtleName: 'Turtle 06', sidNumber: '06', strandingIdNumber: '106', species: 'XX' } as SeaTurtleModel,
    ];
  }
};

export default SeaTurtleService;