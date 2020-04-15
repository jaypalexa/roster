import { queryByAttribute, render } from '@testing-library/react';
import React from 'react';
import WashbackEvents from './WashbackEvents';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<WashbackEvents />);
  const theComponent = getById(dom.container, 'washback-events');
  expect(theComponent).toBeInTheDocument();
});
