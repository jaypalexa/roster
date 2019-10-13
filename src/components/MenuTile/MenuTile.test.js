import React from 'react';
import ReactDOM from 'react-dom';
import MenuTile from './MenuTile';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MenuTile />, div);
  ReactDOM.unmountComponentAtNode(div);
});
