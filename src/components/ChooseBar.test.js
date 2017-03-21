import React from 'react';
import ReactDOM from 'react-dom';
import ChooseBar from './ChooseBar';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      storagePrefix:'eureka__'
    },
    view: {
      focusedMediaItem: undefined
    }
  };

  ReactDOM.render(<ChooseBar {...props} />, div);
});

it('choose button of Virtual DOM should be initially disabled if focused media item is undefined', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      storagePrefix:'eureka__'
    },
    view: {
      focusedMediaItem: undefined
    }
  };

  ReactDOM.render(<ChooseBar {...props} />, div);

  if(!div.querySelector(`#${props.config.storagePrefix}choose-button`).hasAttribute('disabled')) {
    const err = 'choose button of Virtual DOM should be initially disabled if focused media item is undefined';
    throw new Error(err);
  }
});

it('choose button of Virtual DOM should not be initially disabled if focused media item is defined', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      storagePrefix:'eureka__'
    },
    view: {
      focusedMediaItem: {
        filename:'foo.jpg'
      }
    }
  };

  ReactDOM.render(<ChooseBar {...props} />, div);

  if(div.querySelector(`#${props.config.storagePrefix}choose-button`).hasAttribute('disabled')) {
    const err = 'choose button of Virtual DOM should not be initially disabled if focused media item is defined';
    throw new Error(err);
  }
});

it('renders a snapshot', () => {
  const props = {
    config: {
      storagePrefix:'eureka__'
    },
    view: {
      focusedMediaItem: {
        filename:'foo.jpg'
      }
    }
  };

  const chooseBar = renderer.create(<ChooseBar {...props} />).toJSON();
  expect(chooseBar).toMatchSnapshot();
});
