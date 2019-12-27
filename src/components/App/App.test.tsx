import App from './App';
import React from 'react';
import { queryByAttribute, render } from '@testing-library/react';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<App />);
  const appComponent = getById(dom.container, 'app');
  expect(appComponent).toBeInTheDocument();
});
