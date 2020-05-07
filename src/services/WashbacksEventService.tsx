import { toNumber } from 'utils';
import WashbacksEventModel from '../types/WashbacksEventModel';

const WashbacksEventService = {
  getWashbacksEvent(washbacksEventId?: string): WashbacksEventModel {
    let washbacksEvent: WashbacksEventModel | undefined;
    if (washbacksEventId) {
      const washbacksEvents = this.getWashbacksEvents();
      washbacksEvent = washbacksEvents.find(x => x.washbacksEventId === washbacksEventId);
    }
    return washbacksEvent || {} as WashbacksEventModel;
  },
  saveWashbacksEvent(washbacksEvent: WashbacksEventModel) {
    // TODO: HACK: fix in SQL - released total
    if (washbacksEvent.eventType === 'Released') {
      washbacksEvent.beachEventCount = toNumber(washbacksEvent.beachEventCount);
      washbacksEvent.offshoreEventCount = toNumber(washbacksEvent.offshoreEventCount);
      washbacksEvent.eventCount = washbacksEvent.beachEventCount + washbacksEvent.offshoreEventCount;
    } else {
      washbacksEvent.eventCount = toNumber(washbacksEvent.eventCount);
    }
    const washbacksEvents = this.getWashbacksEvents();
    const index = washbacksEvents.findIndex(x => x.washbacksEventId === washbacksEvent.washbacksEventId);
    if (~index) {
      washbacksEvents[index] = {...washbacksEvent};
    } else {
      washbacksEvents.push(washbacksEvent);
    }
    localStorage.setItem('washbacksEvents', JSON.stringify(washbacksEvents));
  },
  deleteWashbacksEvent(washbacksEventId: string) {
    const washbacksEvents = this.getWashbacksEvents();
    const index = washbacksEvents.findIndex(x => x.washbacksEventId === washbacksEventId);
    if (~index) {
      washbacksEvents.splice(index, 1);
    }
    localStorage.setItem('washbacksEvents', JSON.stringify(washbacksEvents));
  },
  getWashbacksEvents(): WashbacksEventModel[] {
    return JSON.parse(localStorage.getItem('washbacksEvents') || '[]');
  }
};

export default WashbacksEventService;