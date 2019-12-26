import React from 'react';
import ReactDOM from 'react-dom';
import SeaTurtles from './SeaTurtles';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SeaTurtles />, div);
  ReactDOM.unmountComponentAtNode(div);
});
