import React from 'react';
import ReactDOM from 'react-dom';
import ChooseBar from './ChooseBar';

import renderer from 'react-test-renderer';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from '../../i18n/locales/en.json';

addLocaleData([...en]);

const ChooseBarIntl = injectIntl(ChooseBar);

it('renders without crashing', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      storagePrefix: 'eureka__'
    },
    view: {
      focusedMediaItem: undefined
    }
  };



  ReactDOM.render(<IntlProvider><ChooseBarIntl {...props} /></IntlProvider>, div);
});

it('choose button of Virtual DOM should be initially disabled if focused media item is undefined', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      storagePrefix:'eureka__'
    },
    view: {
      focusedMediaItem: undefined
    }
  };

  ReactDOM.render(<IntlProvider><ChooseBarIntl {...props} /></IntlProvider>, div);

  if(!div.querySelector(`#${props.config.storagePrefix}choose-button`).hasAttribute('disabled')) {
    const err = 'choose button of Virtual DOM should be initially disabled if focused media item is undefined';
    throw new Error(err);
  }
});

it('choose button of Virtual DOM should not be initially disabled if focused media item is defined', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      storagePrefix:'eureka__'
    },
    view: {
      focusedMediaItem: {
        filename:'foo.jpg'
      }
    }
  };

  ReactDOM.render(<IntlProvider><ChooseBarIntl {...props} /></IntlProvider>, div);

  if(div.querySelector(`#${props.config.storagePrefix}choose-button`).hasAttribute('disabled')) {
    const err = 'choose button of Virtual DOM should not be initially disabled if focused media item is defined';
    throw new Error(err);
  }
});

it('renders a snapshot', () => {
  const props = {
    config: {
      storagePrefix:'eureka__'
    },
    view: {
      focusedMediaItem: {
        filename:'foo.jpg'
      }
    }
  };

  const chooseBar = renderer.create(<IntlProvider><ChooseBarIntl {...props} /></IntlProvider>).toJSON();
  expect(chooseBar).toMatchSnapshot();
});
