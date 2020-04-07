import SeaTurtleTagModel from '../types/SeaTurtleTagModel';

const SeaTurtleTagService = {
  getSeaTurtleTag(turtleTagId?: string): SeaTurtleTagModel {
    let seaTurtleTag: SeaTurtleTagModel | undefined;
    if (turtleTagId) {
      const seaTurtleTags = this.getAllSeaTurtleTags();
      seaTurtleTag = seaTurtleTags.find(x => x.turtleTagId === turtleTagId);
    }
    return seaTurtleTag || {} as SeaTurtleTagModel;
  },
  saveSeaTurtleTag(seaTurtleTag: SeaTurtleTagModel) {
    const seaTurtleTags = this.getAllSeaTurtleTags();
    const index = seaTurtleTags.findIndex(x => x.turtleTagId === seaTurtleTag.turtleTagId);
    if (~index) {
      seaTurtleTags[index] = {...seaTurtleTag};
    } else {
      seaTurtleTags.push(seaTurtleTag);
    }
    localStorage.setItem('seaTurtleTags', JSON.stringify(seaTurtleTags));
  },
  deleteSeaTurtleTag(turtleTagId: string) {
    const seaTurtleTags = this.getAllSeaTurtleTags();
    const index = seaTurtleTags.findIndex(x => x.turtleTagId === turtleTagId);
    if (~index) {
      seaTurtleTags.splice(index, 1);
    }
    localStorage.setItem('seaTurtleTags', JSON.stringify(seaTurtleTags));
  },
  getSeaTurtleTagsForTurtle(turtleId?: string): SeaTurtleTagModel[] {
    const allSeaTurtleTags: SeaTurtleTagModel[] = JSON.parse(localStorage.getItem('seaTurtleTags') || '[]')
    const seaTurtleTags = allSeaTurtleTags.length > 0 ? allSeaTurtleTags.filter(tag => tag.turtleId === turtleId) : [];
    return seaTurtleTags;
  },
  getAllSeaTurtleTags(): SeaTurtleTagModel[] {
    return JSON.parse(localStorage.getItem('seaTurtleTags') || '[]');
  }
};

export default SeaTurtleTagService;