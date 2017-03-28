import React from 'react';
import ReactDOM from 'react-dom';
import MediaRow from './MediaRow';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

import renderer from 'react-test-renderer';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from '../../i18n/locales/data.json';

addLocaleData([...en]);

const MediaRowIntl = injectIntl(MediaRow);

import { fetchMediaSourcesData, updateSourceTreeData, fetchDirectoryContentsData } from '../model/dummy';

const actions = require('../model/actions'),
store = require('../model/store');

store.dispatch(actions.fetchMediaSourcesSuccess(
  fetchMediaSourcesData
));

store.dispatch(actions.updateSourceTreeSuccess(
  updateSourceTreeData
));

store.dispatch(actions.fetchDirectoryContentsSuccess(
  fetchDirectoryContentsData
));

it('renders without crashing', () => {
  const tbody = document.createElement('tbody');

  const state = store.getState();
  const props = Object.assign({}, state, {
    item: state.content.contents[0],
    view: {
      focusedMediaItem: state.content.contents[0]
    },
    onFocus:function(){}
  });

  ReactDOM.render(<IntlProvider><MediaRowIntl {...props} /></IntlProvider>, tbody);
});


it('renders a snapshot', () => {
  const state = store.getState();
  const props = Object.assign({}, state, {
    item: state.content.contents[0],
    view: {
      focusedMediaItem: state.content.contents[0]
    },
    onFocus:function(){}
  });

  const mediaRow = renderer.create(<IntlProvider><MediaRowIntl {...props} /></IntlProvider>).toJSON();
  expect(mediaRow).toMatchSnapshot();
});
