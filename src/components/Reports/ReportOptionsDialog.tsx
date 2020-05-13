import useMount from 'hooks/UseMount';
import React from 'react';
import Modal from 'react-modal';
import ReportListItemModel from 'types/ReportListItemModel';

interface ReportOptionsDialogProps {
  isActive: boolean,
  reportListItem: ReportListItemModel,
  onGenerate: (reportListItem: ReportListItemModel, reportOptions: any) => void,
  onCancel: () => void,
}

const ReportOptionsDialog: React.FC<ReportOptionsDialogProps> = ({isActive, reportListItem, onGenerate, onCancel}) => {

  useMount(() => {
    Modal.setAppElement('#app')
  });

  var titleText = 'Report Options';
  var bodyText = 'TODO:  *** REPORT OPTIONS GO HERE!!! ***';

  const onGenerateClick = () => {
    const reportOptions = {
      seaTurtleId: 'a3c460ff-ed73-4f9d-9b89-f6f605a7d795',
      populateFacilityField: true,
    };
    onGenerate(reportListItem, reportOptions);
  }

  return (
    <Modal isOpen={isActive}>
      <div className={`modal ${isActive ? 'is-active' : ''}`}>
        <div className='modal-background'></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>{reportListItem.reportName} Options</p>
          </header>
          <section className='modal-card-body'>
            <p>{bodyText}</p>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-success' onClick={onGenerateClick}>Generate</button>
            <button className='button is-danger' onClick={onCancel}>Cancel</button>
          </footer>
        </div>
      </div>
    </Modal>
  );
};

export default ReportOptionsDialog;
