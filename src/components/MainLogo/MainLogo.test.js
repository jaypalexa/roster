import React from 'react';
import ReactDOM from 'react-dom';
import MainMenu from './MainMenu';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MainMenu />, div);
  ReactDOM.unmountComponentAtNode(div);
});
