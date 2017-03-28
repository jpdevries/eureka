import React from 'react';
import ReactDOM from 'react-dom';
import SearchBar from './SearchBar';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from '../../i18n/locales/data.json';

addLocaleData([...en]);

const SearchBarIntl = injectIntl(SearchBar);

const actions = require('../model/actions'),
store = require('../model/store');

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
})(SearchBarIntl);

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render((
    <Provider store={store}>
      <IntlProvider>
        <SearchBarController />
      </IntlProvider>
    </Provider>
  ), div);
});

const filter = new Date().getTime().toString();
store.dispatch(actions.updateView({
  filter:filter
}));

it('the search bar input should reflect the value of view.filter', () => {
  const div = document.createElement('div');

  ReactDOM.render((
    <Provider store={store}>
      <IntlProvider>
        <SearchBarController />
      </IntlProvider>
    </Provider>
  ), div);

  if(div.querySelector('input').value !== filter) {
    const err = `the search bar input should reflect the value of view.filter expecing ${filter}`;
    console.log(err);
    throw new Error(err);
  }
});
