import React from 'react';
import ReactDOM from 'react-dom';
import HoldingTanks from './HoldingTanks';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HoldingTanks />, div);
  ReactDOM.unmountComponentAtNode(div);
});
