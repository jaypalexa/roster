import SeaTurtleModel from '../types/SeaTurtleModel';

const SeaTurtleService = {
  getSeaTurtle(turtleId?: string): SeaTurtleModel {
    let seaTurtle: SeaTurtleModel | undefined;
    if (turtleId) {
      const seaTurtles = this.getSeaTurtles('');
      seaTurtle = seaTurtles.find(x => x.turtleId === turtleId);
    }
    return seaTurtle || {} as SeaTurtleModel;
    //return JSON.parse(localStorage.getItem('seaTurtle') || '{}');
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
  getSeaTurtles(organizationId: string): SeaTurtleModel[] {
    return JSON.parse(localStorage.getItem('seaTurtles') || '[]');
    // return [
    //   { turtleId: '11111111-1111-1111-1111-111111111111', turtleName: 'Turtle 01', sidNumber: '01', strandingIdNumber: '101', species: 'CM' } as SeaTurtleModel,
    //   { turtleId: '22222222-2222-2222-2222-222222222222', turtleName: 'Turtle 02', sidNumber: '02', strandingIdNumber: '102', species: 'EI' } as SeaTurtleModel,
    //   { turtleId: '33333333-3333-3333-3333-333333333333', turtleName: 'Turtle 03', sidNumber: '03', strandingIdNumber: '103', species: 'LO' } as SeaTurtleModel,
    //   { turtleId: '44444444-4444-4444-4444-444444444444', turtleName: 'Turtle 04', sidNumber: '04', strandingIdNumber: '104', species: 'DC' } as SeaTurtleModel,
    //   { turtleId: '55555555-5555-5555-5555-555555555555', turtleName: 'Turtle 05', sidNumber: '05', strandingIdNumber: '105', species: 'HB' } as SeaTurtleModel,
    //   { turtleId: '66666666-6666-6666-6666-666666666666', turtleName: 'Turtle 06', sidNumber: '06', strandingIdNumber: '106', species: 'XX' } as SeaTurtleModel,
    // ];
  }
};

export default SeaTurtleService;