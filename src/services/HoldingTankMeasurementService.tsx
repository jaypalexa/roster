import TypeHelper from '../helpers/TypeHelper';
import HoldingTankMeasurementModel from '../types/HoldingTankMeasurementModel';

const HoldingTankMeasurementService = {
  getHoldingTankMeasurement(tankMeasurementId?: string): HoldingTankMeasurementModel {
    let holdingTankMeasurement: HoldingTankMeasurementModel | undefined;
    if (tankMeasurementId) {
      const holdingTankMeasurements = this.getAllHoldingTankMeasurements();
      holdingTankMeasurement = holdingTankMeasurements.find(x => x.tankMeasurementId === tankMeasurementId);
    }
    return holdingTankMeasurement || {} as HoldingTankMeasurementModel;
  },
  saveHoldingTankMeasurement(holdingTankMeasurement: HoldingTankMeasurementModel) {
    holdingTankMeasurement.temperature = TypeHelper.toNumber(holdingTankMeasurement.temperature);
    holdingTankMeasurement.salinity = TypeHelper.toNumber(holdingTankMeasurement.salinity);
    holdingTankMeasurement.ph = TypeHelper.toNumber(holdingTankMeasurement.ph);

    const holdingTankMeasurements = this.getAllHoldingTankMeasurements();
    const index = holdingTankMeasurements.findIndex(x => x.tankMeasurementId === holdingTankMeasurement.tankMeasurementId);
    if (~index) {
      holdingTankMeasurements[index] = { ...holdingTankMeasurement };
    } else {
      holdingTankMeasurements.push(holdingTankMeasurement);
    }
    localStorage.setItem('holdingTankMeasurements', JSON.stringify(holdingTankMeasurements));
  },
  deleteHoldingTankMeasurement(tankMeasurementId: string) {
    const holdingTankMeasurements = this.getAllHoldingTankMeasurements();
    const index = holdingTankMeasurements.findIndex(x => x.tankMeasurementId === tankMeasurementId);
    if (~index) {
      holdingTankMeasurements.splice(index, 1);
    }
    localStorage.setItem('holdingTankMeasurements', JSON.stringify(holdingTankMeasurements));
  },
  getHoldingTankMeasurementsForTank(tankId?: string): HoldingTankMeasurementModel[] {
    const allHoldingTankMeasurements: HoldingTankMeasurementModel[] = JSON.parse(localStorage.getItem('holdingTankMeasurements') || '[]')
    const holdingTankMeasurements = allHoldingTankMeasurements.length > 0 ? allHoldingTankMeasurements.filter(tag => tag.tankId === tankId) : [];
    return holdingTankMeasurements;
  },
  getAllHoldingTankMeasurements(): HoldingTankMeasurementModel[] {
    return JSON.parse(localStorage.getItem('holdingTankMeasurements') || '[]');
  }
};

export default HoldingTankMeasurementService;