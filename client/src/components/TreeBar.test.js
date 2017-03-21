import React from 'react';
import ReactDOM from 'react-dom';
import TreeBar from './TreeBar';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      allowUploads:true
    },
    content: {
      cd: './',
      contents: []
    }
  };

  ReactDOM.render(<TreeBar {...props} />, div);
});

it('should render an upload button if allowUploads is set to true', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      allowUploads:true
    },
    content: {
      cd: './',
      contents: []
    }
  };

  ReactDOM.render(<TreeBar {...props} />, div);

  if(!div.querySelector('svg.icon-upload')) {
    const err = 'it should render an upload button if allowUploads is set to true';
    throw new Error(err);
  }
});

it('should not render an upload button if allowUploads is not set to true', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      allowUploads:false
    },
    content: {
      cd: './',
      contents: []
    }
  };

  ReactDOM.render(<TreeBar {...props} />, div);

  if(div.querySelector('svg.icon-upload')) {
    const err = 'it should render an upload button if allowUploads is set to true';
    throw new Error(err);
  }
});
