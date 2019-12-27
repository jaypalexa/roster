import NotFound from './NotFound';
import React from 'react';
import { queryByAttribute, render } from '@testing-library/react';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<NotFound />);
  const theComponent = getById(dom.container, 'not-found');
  expect(theComponent).toBeInTheDocument();
});
