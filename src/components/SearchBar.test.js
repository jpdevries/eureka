import React from 'react';
import ReactDOM from 'react-dom';
import SearchBar from './SearchBar';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

const actions = require('../model/actions'),
store = require('../model/store');

it('renders without crashing', () => {
  const div = document.createElement('div');

  const SearchBarController = connect(function(state, props) { // todo list
    return {
      content: state.content,
      view: state.view,
      tree: state.tree,
      source: state.source,
      directory: state.directory,
      fetched: state.fetched,
      config: state.config
    }
  })(SearchBar);

  ReactDOM.render((
    <Provider store={store}>
        <SearchBarController />
    </Provider>
  ), div);
});

const filter = new Date().getTime().toString();
store.dispatch(actions.updateView({
  filter:filter
}));

it('the search bar input should reflect the value of view.filter', () => {
  const div = document.createElement('div');
  const SearchBarController = connect(function(state, props) { // todo list
    return {
      content: state.content,
      view: state.view,
      tree: state.tree,
      source: state.source,
      directory: state.directory,
      fetched: state.fetched,
      config: state.config
    }
  })(SearchBar);

  ReactDOM.render((
    <Provider store={store}>
        <SearchBarController />
    </Provider>
  ), div);

  if(div.querySelector('input').value !== filter) {
    const err = `the search bar input should reflect the value of view.filter expecing ${filter}`;
    console.log(err);
    throw new Error(err);
  }
});
