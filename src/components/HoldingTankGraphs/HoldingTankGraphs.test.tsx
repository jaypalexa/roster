import { queryByAttribute, render } from '@testing-library/react';
import React from 'react';
import HoldingTankGraphs from './HoldingTankGraphs';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<HoldingTankGraphs />);
  const theComponent = getById(dom.container, 'holding-tank-graphs');
  expect(theComponent).toBeInTheDocument();
});
