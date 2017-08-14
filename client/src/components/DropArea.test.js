import React from 'react';
import ReactDOM from 'react-dom';
import DropArea from './DropArea';

import {cssSafe} from '../utility/utility';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from '../../i18n/locales/en.json';

addLocaleData([...en]);

const DropAreaIntl = injectIntl(DropArea);

const actions = require('../model/actions'),
store = require('../model/store');

store.dispatch(actions.updateConfig({
  allowUploads: false
}));

it('renders without crashing', () => {
  const div = document.createElement('div'),
  item = {
    filename: 'sky.jpg'
  };

  ReactDOM.render(<IntlProvider><DropAreaIntl config={{
    storagePrefix:'eureka__'
  }} view={{
    sourceTreeOpen: true
  }} content={{
    cd: './'
  }} /></IntlProvider>, div);

});
