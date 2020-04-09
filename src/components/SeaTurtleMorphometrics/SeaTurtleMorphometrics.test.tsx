import { queryByAttribute, render } from '@testing-library/react';
import React from 'react';
import SeaTurtleMorphometrics from './SeaTurtleMorphometrics';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<SeaTurtleMorphometrics />);
  const theComponent = getById(dom.container, 'sea-turtle-morphometrics');
  expect(theComponent).toBeInTheDocument();
});
