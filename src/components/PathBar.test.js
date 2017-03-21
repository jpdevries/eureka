import React from 'react';
import ReactDOM from 'react-dom';
import PathBar from './PathBar';

import utility from '../utility/utility';

import renderer from 'react-test-renderer';

const pathParse = require('path-parse');

it('renders without crashing', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      allowRename: false,
      allowDelete: false
    },
    view: {
      focusedMediaItem: {
        directory:'/',
        absoluteURL:'cheese.jpg',
        filename:'cheese.jpg'
      }
    }
  };

  ReactDOM.render(<PathBar {...props} />, div);
});

it('should display the correct icon based on filename extension', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      allowRename: false,
      allowDelete: false
    },
    view: {
      focusedMediaItem: {
        directory:'/',
        absoluteURL:'cheese.jpg',
        filename:'cheese.jpg'
      }
    }
  };

  ReactDOM.render(<PathBar {...props} />, div);

  const icon = utility.getIconByExtension(pathParse(props.view.focusedMediaItem.filename).ext);

  if(!div.querySelector('use').getAttribute('xlink:href').includes(`icon-${icon}`)) {
    const err = `It should display the correct icon based on the filename extension`;
    console.log(err);
    throw new Error(err);
  }
});

it('summary should contain correct absolutePath', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      allowRename: false,
      allowDelete: false
    },
    view: {
      focusedMediaItem: {
        directory:'/',
        absoluteURL:'cheese.jpg',
        filename:'cheese.jpg',
        absolutePath:'/cheese.jpg'
      }
    }
  };

  ReactDOM.render(<PathBar {...props} />, div);

  if(!div.querySelector('summary').innerHTML.includes(props.view.focusedMediaItem.absolutePath)) {
    const err = `summary should contain correct absolutePath expects ${props.view.focusedMediaItem.absolutePath}`;
    console.log(err);
    throw new Error(err);
  }
});

it('renders a snapshot', () => {
  const props = {
    config: {
      allowRename: false,
      allowDelete: false
    },
    view: {
      focusedMediaItem: {
        directory:'/',
        absoluteURL:'cheese.jpg',
        filename:'cheese.jpg',
        absolutePath:'/cheese.jpg'
      }
    }
  };

  const pathbar = renderer.create(<PathBar {...props} />).toJSON();
  expect(pathbar).toMatchSnapshot();
});
