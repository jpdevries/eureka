import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render((
    <Modal>
      <div>
        <p>Hello World</p>
      </div>
    </Modal>
  ), div);
});

it('renders a snapshot', () => {
  const modal = renderer.create(
    <Modal>
      <div>
        <p>Hello World</p>
      </div>
    </Modal>
  ).toJSON();
  expect(modal).toMatchSnapshot();
});
