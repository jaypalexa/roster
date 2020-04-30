import TypeHelper from '../helpers/TypeHelper';
import HatchlingsEventModel from '../types/HatchlingsEventModel';

const HatchlingsEventService = {
  getHatchlingsEvent(hatchlingsEventId?: string): HatchlingsEventModel {
    let hatchlingsEvent: HatchlingsEventModel | undefined;
    if (hatchlingsEventId) {
      const hatchlingsEvents = this.getHatchlingsEvents();
      hatchlingsEvent = hatchlingsEvents.find(x => x.hatchlingsEventId === hatchlingsEventId);
    }
    return hatchlingsEvent || {} as HatchlingsEventModel;
  },
  saveHatchlingsEvent(hatchlingsEvent: HatchlingsEventModel) {
    // TODO: HACK: fix in SQL - released total
    if (hatchlingsEvent.eventType === 'Released') {
      hatchlingsEvent.beachEventCount = TypeHelper.toNumber(hatchlingsEvent.beachEventCount);
      hatchlingsEvent.offshoreEventCount = TypeHelper.toNumber(hatchlingsEvent.offshoreEventCount);
      hatchlingsEvent.eventCount = hatchlingsEvent.beachEventCount + hatchlingsEvent.offshoreEventCount;
    } else {
      hatchlingsEvent.eventCount = TypeHelper.toNumber(hatchlingsEvent.eventCount);
    }
    const hatchlingsEvents = this.getHatchlingsEvents();
    const index = hatchlingsEvents.findIndex(x => x.hatchlingsEventId === hatchlingsEvent.hatchlingsEventId);
    if (~index) {
      hatchlingsEvents[index] = {...hatchlingsEvent};
    } else {
      hatchlingsEvents.push(hatchlingsEvent);
    }
    localStorage.setItem('hatchlingsEvents', JSON.stringify(hatchlingsEvents));
  },
  deleteHatchlingsEvent(hatchlingsEventId: string) {
    const hatchlingsEvents = this.getHatchlingsEvents();
    const index = hatchlingsEvents.findIndex(x => x.hatchlingsEventId === hatchlingsEventId);
    if (~index) {
      hatchlingsEvents.splice(index, 1);
    }
    localStorage.setItem('hatchlingsEvents', JSON.stringify(hatchlingsEvents));
  },
  getHatchlingsEvents(): HatchlingsEventModel[] {
    return JSON.parse(localStorage.getItem('hatchlingsEvents') || '[]');
  }
};

export default HatchlingsEventService;