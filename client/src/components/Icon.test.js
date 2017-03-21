import React from 'react';
import ReactDOM from 'react-dom';
import Icon from './Icon';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Icon icon="kaas" />, div);
});

it('renders a snapshot', () => {
  const icon = renderer.create(<Icon/>).toJSON();
  expect(icon).toMatchSnapshot();
});
