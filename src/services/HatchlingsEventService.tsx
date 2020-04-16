import HatchlingsEventModel from '../types/HatchlingsEventModel';

const HatchlingsEventService = {
  getHatchlingsEvent(hatchlingsEventId?: string): HatchlingsEventModel {
    let hatchlingsEvent: HatchlingsEventModel | undefined;
    if (hatchlingsEventId) {
      const hatchlingsEvents = this.getHatchlingsEvents('');
      hatchlingsEvent = hatchlingsEvents.find(x => x.hatchlingsEventId === hatchlingsEventId);
    }
    return hatchlingsEvent || {} as HatchlingsEventModel;
  },
  saveHatchlingsEvent(hatchlingsEvent: HatchlingsEventModel) {
    const hatchlingsEvents = this.getHatchlingsEvents('');
    const index = hatchlingsEvents.findIndex(x => x.hatchlingsEventId === hatchlingsEvent.hatchlingsEventId);
    if (~index) {
      hatchlingsEvents[index] = {...hatchlingsEvent};
    } else {
      hatchlingsEvents.push(hatchlingsEvent);
    }
    localStorage.setItem('hatchlingsEvents', JSON.stringify(hatchlingsEvents));
  },
  deleteHatchlingsEvent(hatchlingsEventId: string) {
    const hatchlingsEvents = this.getHatchlingsEvents('');
    const index = hatchlingsEvents.findIndex(x => x.hatchlingsEventId === hatchlingsEventId);
    if (~index) {
      hatchlingsEvents.splice(index, 1);
    }
    localStorage.setItem('hatchlingsEvents', JSON.stringify(hatchlingsEvents));
  },
  getHatchlingsEvents(organizationId: string): HatchlingsEventModel[] {
    return JSON.parse(localStorage.getItem('hatchlingsEvents') || '[]');
  }
};

export default HatchlingsEventService;