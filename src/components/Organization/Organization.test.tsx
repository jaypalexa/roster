import Organization from './Organization';
import React from 'react';
import { queryByAttribute, render } from '@testing-library/react';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<Organization />);
  const theComponent = getById(dom.container, 'organization');
  expect(theComponent).toBeInTheDocument();
});
