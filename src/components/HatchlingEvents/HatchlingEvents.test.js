import React from 'react';
import ReactDOM from 'react-dom';
import HatchlingEvents from './HatchlingEvents';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HatchlingEvents />, div);
  ReactDOM.unmountComponentAtNode(div);
});
