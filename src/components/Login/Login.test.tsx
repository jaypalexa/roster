import { queryByAttribute, render } from '@testing-library/react';
import React from 'react';
import Login from './Login';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<Login />);
  const theComponent = getById(dom.container, 'login');
  expect(theComponent).toBeInTheDocument();
});
