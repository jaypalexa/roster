export default class HomeSummaryModel {
  [key: string]: any;
  activeSeaTurtlesCount: number;
  relinquishedSeaTurtlesCount: number;
  acquiredHatchlingsEventsCount: number;
  diedHatchlingsEventsCount: number;
  releasedHatchlingsEventsCount: number;
  doaHatchlingsEventsCount: number;
  acquiredWashbacksEventsCount: number;
  diedWashbacksEventsCount: number;
  releasedWashbacksEventsCount: number;
  doaWashbacksEventsCount: number;
  holdingTanksCount: number;

  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
    this.activeSeaTurtlesCount = 0;
    this.relinquishedSeaTurtlesCount = 0;
    this.acquiredHatchlingsEventsCount = 0;
    this.diedHatchlingsEventsCount = 0;
    this.releasedHatchlingsEventsCount = 0;
    this.doaHatchlingsEventsCount = 0;
    this.acquiredWashbacksEventsCount = 0;
    this.diedWashbacksEventsCount = 0;
    this.releasedWashbacksEventsCount = 0;
    this.doaWashbacksEventsCount = 0;
    this.holdingTanksCount = 0;
  }
};
