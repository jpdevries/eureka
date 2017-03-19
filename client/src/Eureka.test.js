import React from 'react';
import ReactDOM from 'react-dom';
import Eureka from './Eureka';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

const actions = require('./model/actions'),
store = require('./model/store');

function getEurekaProvider() {
  const props = {},
  EurekaController = connect(function(state, props) { // todo list
    return {
      content: state.content,
      view: state.view,
      tree: state.tree,
      source: state.source,
      directory: state.directory,
      fetched: state.fetched,
      config: state.config
    }
  })(Eureka);

  return (
    <Provider store={store}>
        <EurekaController />
    </Provider>
  );
}

it('renders without crashing', () => {
  const div = document.createElement('div'),
  Provider = getEurekaProvider();
  ReactDOM.render(Provider, div);
});

it('supports storagePrefix configuration through props', () => {
  const div = document.createElement('div');
  const props = {
    storagePrefix:'yolo__'
  };

  store.dispatch(actions.updateConfig(props));

  const Provider = getEurekaProvider();

  ReactDOM.render(Provider, div);

  if(!div.innerHTML.includes(props.storagePrefix)) {
    const err = `Rendered markup should contain storage prefix: ${props.storagePrefix}`;
    console.log(err);
    throw new Error(err);
  }

});

it('supports view mode configuration through props', () => {
  const div = document.createElement('div');
  const props = {
    mode:'list'
  };

  store.dispatch(actions.updateConfig(props));

  const Provider = getEurekaProvider();

  ReactDOM.render(Provider, div);

  //console.log(div.innerHTML);

  if(div.querySelector('input[name="eureka__view"]:checked').value !== props.mode) {
    throw new Error(`Mode attribute should initially check associated view radio input. Expected ${props.mode}`)
  }

});

it('should remove upload form if allowUploads is set to false', () => {
  const div = document.createElement('div');
  const props = {
    allowUploads:false
  };

  store.dispatch(actions.updateConfig(props));

  const Provider = getEurekaProvider();
  ReactDOM.render(Provider, div);


  //console.log(div.querySelector('eureka__upload-form'));

  if(div.querySelector('#eureka__upload-form')) {
    const err = `#eureka__upload-form should be null if allowUploads is set to false`;
    console.log(err);
    throw new Error(err);
  }

});

it('should not remove upload form if allowUploads is not set to false', () => {
  const div = document.createElement('div');
  const props = {
    allowUploads:true
  };

  store.dispatch(actions.updateConfig(props));

  const Provider = getEurekaProvider();
  ReactDOM.render(Provider, div);


  //console.log(div.querySelector('eureka__upload-form'));

  if(!div.querySelector('#eureka__upload-form')) {
    const err = `#eureka__upload-form should not be null if allowUploads is not set to false`;
    console.log(err);
    throw new Error(err);
  }

});

it('should hide media source panel if treeHidden is set to true', () => {
  const div = document.createElement('div');
  const props = {
    treeHidden:true
  };

  store.dispatch(actions.updateConfig(props));

  const Provider = getEurekaProvider();
  ReactDOM.render(Provider, div);

  if(div.querySelector('#eureka__pathbrowser')) {
    const err = `$eureka__pathbrowser should not be present in the DOM if treeHidden is set to true`;
    console.log(err);
    throw new Error(err);
  }

});

it('should not hide media source panel if treeHidden is not set to true', () => {
  const div = document.createElement('div');
  const props = {
    treeHidden:false
  };

  store.dispatch(actions.updateConfig(props));

  const Provider = getEurekaProvider();
  ReactDOM.render(Provider, div);

  if(!div.querySelector('#eureka__pathbrowser')) {
    const err = `$eureka__pathbrowser should be present in the DOM if treeHidden is not set to true`;
    console.log(err);
    throw new Error(err);
  }

});

it('should remove upload features from media source tree if allowUploads is set to false', () => {
  const div = document.createElement('div');
  const props = {
    allowUploads:false,
    treeHidden:false
  };

  store.dispatch(actions.updateConfig(props));

  const Provider = getEurekaProvider();
  ReactDOM.render(Provider, div);

  if(div.querySelector('.eureka__drop-area')) {
    const err = `.eureka__drop-area should be null if allowUploads is set to false`;
    console.log(err);
    throw new Error(err);
  }

});

it('should not remove upload features from media source tree if allowUploads is not set to false', () => {
  const div = document.createElement('div');
  const props = {
    allowUploads:true,
    treeHidden:false
  };

  store.dispatch(actions.updateConfig(props));

  const Provider = getEurekaProvider();
  ReactDOM.render(Provider, div);

  if(!div.querySelector('.eureka__drop-area')) {
    const err = `.eureka__drop-area should be null if allowUploads is set to false`;
    console.log(err);
    throw new Error(err);
  }

});

it('should not remove upload features from media source tree if allowUploads is not set to false', () => {
  const div = document.createElement('div');
  const props = {
    allowUploads:true,
    treeHidden:false
  };

  store.dispatch(actions.updateConfig(props));

  const Provider = getEurekaProvider();
  ReactDOM.render(Provider, div);

  if(!div.querySelector('.eureka__drop-area')) {
    const err = `.eureka__drop-area should be null if allowUploads is set to false`;
    console.log(err);
    throw new Error(err);
  }

});