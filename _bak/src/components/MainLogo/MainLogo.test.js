import React from 'react';
import ReactDOM from 'react-dom';
import MainLogo from './MainLogo';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MainLogo />, div);
  ReactDOM.unmountComponentAtNode(div);
});
