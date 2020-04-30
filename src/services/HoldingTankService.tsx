import HoldingTankModel from '../types/HoldingTankModel';

const HoldingTankService = {
  getHoldingTank(tankId?: string): HoldingTankModel {
    let holdingTank: HoldingTankModel | undefined;
    if (tankId) {
      const holdingTanks = this.getHoldingTanks();
      holdingTank = holdingTanks.find(x => x.tankId === tankId);
    }
    return holdingTank || {} as HoldingTankModel;
  },
  saveHoldingTank(holdingTank: HoldingTankModel) {
    const holdingTanks = this.getHoldingTanks();
    const index = holdingTanks.findIndex(x => x.tankId === holdingTank.tankId);
    if (~index) {
      holdingTanks[index] = {...holdingTank};
    } else {
      holdingTanks.push(holdingTank);
    }
    localStorage.setItem('holdingTanks', JSON.stringify(holdingTanks));
  },
  deleteHoldingTank(tankId: string) {
    const holdingTanks = this.getHoldingTanks();
    const index = holdingTanks.findIndex(x => x.tankId === tankId);
    if (~index) {
      holdingTanks.splice(index, 1);
    }
    localStorage.setItem('holdingTanks', JSON.stringify(holdingTanks));
  },
  getHoldingTanks(): HoldingTankModel[] {
    return JSON.parse(localStorage.getItem('holdingTanks') || '[]');
  }
};

export default HoldingTankService;