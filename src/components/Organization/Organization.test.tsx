import { queryByAttribute, render } from '@testing-library/react';
import React from 'react';
import Organization from './Organization';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<Organization />);
  const theComponent = getById(dom.container, 'organization');
  expect(theComponent).toBeInTheDocument();
});
