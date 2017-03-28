import React from 'react';
import ReactDOM from 'react-dom';
import TreeBar from './TreeBar';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from '../../i18n/locales/data.json';

addLocaleData([...en]);

const TreeBarIntl = injectIntl(TreeBar);

it('renders without crashing', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      allowUploads:true
    },
    content: {
      cd: './',
      contents: []
    }
  };

  ReactDOM.render(<IntlProvider><TreeBarIntl {...props} /></IntlProvider>, div);
});

it('should render an upload button if allowUploads is set to true', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      allowUploads:true
    },
    content: {
      cd: './',
      contents: []
    }
  };

  ReactDOM.render(<IntlProvider><TreeBarIntl {...props} /></IntlProvider>, div);

  if(!div.querySelector('svg.icon-upload')) {
    const err = 'it should render an upload button if allowUploads is set to true';
    throw new Error(err);
  }
});

it('should not render an upload button if allowUploads is not set to true', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      allowUploads:false
    },
    content: {
      cd: './',
      contents: []
    }
  };

  ReactDOM.render(<IntlProvider><TreeBarIntl {...props} /></IntlProvider>, div);

  if(div.querySelector('svg.icon-upload')) {
    const err = 'it should render an upload button if allowUploads is set to true';
    throw new Error(err);
  }
});
