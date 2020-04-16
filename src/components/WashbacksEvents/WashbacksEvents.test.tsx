import { queryByAttribute, render } from '@testing-library/react';
import React from 'react';
import WashbacksEvents from './WashbacksEvents';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<WashbacksEvents />);
  const theComponent = getById(dom.container, 'washbacks-events');
  expect(theComponent).toBeInTheDocument();
});
