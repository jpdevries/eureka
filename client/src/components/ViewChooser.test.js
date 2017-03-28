import React from 'react';
import ReactDOM from 'react-dom';
import ViewChooser from './ViewChooser';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from '../../i18n/locales/data.json';

addLocaleData([...en]);

const ViewChooserIntl = injectIntl(ViewChooser);

const actions = require('../model/actions'),
store = require('../model/store');

it('renders without crashing', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      storagePrefix:'eureka__'
    },
    view: {
      focusedMediaItem: undefined
    }
  };

  ReactDOM.render(<IntlProvider><ViewChooserIntl {...props} /></IntlProvider>, div);
});

it('should check the radio associated with the current view mode', () => {
  const div = document.createElement('div');
  const mode = 'list';
  const props = {
    config: {
      storagePrefix:'eureka__'
    },
    view: {
      focusedMediaItem: undefined,
      mode:mode
    }
  };

  ReactDOM.render(<IntlProvider><ViewChooserIntl {...props} /></IntlProvider>, div);

  if(div.querySelector('input[type="radio"]:checked').value !== mode) {
    const err = 'should check the radio associated with the current view mode';
    throw new Error(err);
  }
});

it('should update the Redux store when a view mode radio input is checked', () => {
  const div = document.createElement('div');
  const mode = 'list';
  const props = {
    config: {
      storagePrefix:'eureka__'
    },
    view: {
      focusedMediaItem: undefined,
      mode:mode
    }
  };

  ReactDOM.render(<IntlProvider><ViewChooserIntl {...props} /></IntlProvider>, div);

  new Promise((resolve, reject) => {
    const radios = div.querySelectorAll('input[type="radio"]'),
    randomRadio = radios[Math.round(Math.random() * radios.length - 1)];

    store.subscribe(() => {
      resolve(store.getState())
    });

    randomRadio.checked = true;
  }).then((state) => {
    if(state.view.mode !== randomRadio.value) {
      const err = 'should update the Redux store when a view mode radio input is checked';
      throw new Error(err);
    }
  })

});
