import React from 'react';
import Reports from './Reports';
import { queryByAttribute, render } from '@testing-library/react';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<Reports />);
  const theComponent = getById(dom.container, 'reports');
  expect(theComponent).toBeInTheDocument();
});
