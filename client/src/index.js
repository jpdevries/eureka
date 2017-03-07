import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

import Eureka from './Eureka'; 

const actions = require('./model/actions'),
store = require('./model/store');

const EurekaController = connect(function(state, props) { // todo list
    return {
      content: state.content,
      view: state.view,
      tree: state.tree,
      source: state.source,
      directory: state.directory,
      fetched: state.fetched
    }
})(Eureka);

store.subscribe(() => {
  console.log(store.getState());
});

ReactDOM.render(
  <Provider store={store}>
      <EurekaController />
  </Provider>, 
  document.getElementById('root')
);
