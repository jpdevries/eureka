import React from 'react';
import ReactDOM from 'react-dom';
import { EurekaMediaBrowser } from './EurekaMediaBrowser';

import { createStore } from 'redux';

import { connect, Provider } from 'react-redux';

import renderer from 'react-test-renderer';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from './../i18n/locales/en.json';

addLocaleData([...en]);

const actions = require('./model/actions'),
store = require('./model/store'),
initialConfig = store.getState();


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<EurekaMediaBrowser />, div);
  console.log(div.outerHTML);
});
