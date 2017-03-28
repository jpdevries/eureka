import React from 'react';
import ReactDOM from 'react-dom';
import MediaSourceSelector from './MediaSourceSelector';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

import renderer from 'react-test-renderer';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from '../../i18n/locales/en.json';

addLocaleData([...en]);

const MediaSourceSelectorIntl = injectIntl(MediaSourceSelector);

const actions = require('../model/actions'),
store = require('../model/store');

function getMediaSourceSelectorController() {
  return connect(function(state, props) { // todo list
    return {
      content: state.content,
      view: state.view,
      tree: state.tree,
      source: state.source,
      directory: state.directory,
      fetched: state.fetched,
      config: state.config
    }
  })(MediaSourceSelectorIntl);
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  const MediaSourceSelectorController = getMediaSourceSelectorController();

  ReactDOM.render((
    <Provider store={store}>
        <IntlProvider><MediaSourceSelectorController /></IntlProvider>
    </Provider>
  ), div);
});



it('renders a snapshot', () => {
  const MediaSourceSelectorController = getMediaSourceSelectorController();
  const mediaSource = renderer.create(
    <Provider store={store}>
        <IntlProvider><MediaSourceSelectorController /></IntlProvider>
    </Provider>
  ).toJSON();

  expect(mediaSource).toMatchSnapshot();
});
