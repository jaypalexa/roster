import { queryByAttribute, render } from '@testing-library/react';
import React from 'react';
import SeaTurtleTags from './SeaTurtleTags';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<SeaTurtleTags />);
  const theComponent = getById(dom.container, 'sea-turtle-tags');
  expect(theComponent).toBeInTheDocument();
});
