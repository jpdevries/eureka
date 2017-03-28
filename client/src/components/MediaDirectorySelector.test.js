import React from 'react';
import ReactDOM from 'react-dom';
import MediaDirectorySelector from './MediaDirectorySelector';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

import renderer from 'react-test-renderer';

const actions = require('../model/actions'),
store = require('../model/store');

import utility from '../utility/utility';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from '../../i18n/locales/data.json';

addLocaleData([...en]);

const MediaDirectorySelectorIntl = injectIntl(MediaDirectorySelector);

import { fetchMediaSourcesData, updateSourceTreeData, fetchDirectoryContentsData } from '../model/dummy';

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
  const div = document.createElement('div');

  const state = store.getState();
  const props = Object.assign({}, state, {
  });

  ReactDOM.render(<IntlProvider><MediaDirectorySelectorIntl {...props} /></IntlProvider>, div);
});
