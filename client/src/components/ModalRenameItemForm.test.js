import React from 'react';
import ReactDOM from 'react-dom';
import ModalRenameItemForm from './ModalRenameItemForm';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

import renderer from 'react-test-renderer';

import { fetchMediaSourcesData, updateSourceTreeData, fetchDirectoryContentsData } from '../model/dummy';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from '../../i18n/locales/en.json';

addLocaleData([...en]);

const ModalRenameItemFormIntl = injectIntl(ModalRenameItemForm);

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
  const div = document.createElement('div'),
  state = store.getState(),
  props = Object.assign({}, state, {
    item: state.content.contents[0],
    view: {
      focusedMediaItem: state.content.contents[0]
    }
  });

  ReactDOM.render(<IntlProvider><ModalRenameItemFormIntl {...props} /></IntlProvider>, div);
});
