import React from 'react';
import ReactDOM from 'react-dom';
import PathBar from './PathBar';

import utility from '../utility/utility';

import renderer from 'react-test-renderer';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from '../../i18n/locales/en.json';

addLocaleData([...en]);

const PathBarIntl = injectIntl(PathBar);

const pathParse = require('path-parse');

it('renders without crashing', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      allowRename: false,
      allowDelete: false
    },
    view: {
      focusedMediaItem: {
        directory:'/',
        absoluteURL:'cheese.jpg',
        filename:'cheese.jpg'
      }
    },
    content: {
      contents: [],
      chosenMediaItems: [],
      chosenMediaItemsInverted: []
    }
  };

  ReactDOM.render(<IntlProvider><PathBarIntl {...props} /></IntlProvider>, div);
});

it('should display the correct icon based on filename extension', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      allowRename: false,
      allowDelete: false
    },
    view: {
      focusedMediaItem: {
        directory:'/',
        absoluteURL:'cheese.jpg',
        filename:'cheese.jpg'
      }
    },
    content: {
      contents: [],
      chosenMediaItems: [],
      chosenMediaItemsInverted: []
    }
  };

  ReactDOM.render(<IntlProvider><PathBarIntl {...props} /></IntlProvider>, div);

  const icon = utility.getIconByExtension(pathParse(props.view.focusedMediaItem.filename).ext);

  if(!div.querySelector('use').getAttribute('xlink:href').includes(`icon-${icon}`)) {
    const err = `It should display the correct icon based on the filename extension`;
    console.log(err);
    throw new Error(err);
  }
});

it('summary should contain correct path', () => {
  const div = document.createElement('div');

  const props = {
    config: {
      allowRename: false,
      allowDelete: false
    },
    view: {
      focusedMediaItem: {
        directory:'/',
        absoluteURL:'cheese.jpg',
        filename:'cheese.jpg',
        path:'/cheese.jpg'
      }
    },
    content: {
      contents: [],
      chosenMediaItems: [],
      chosenMediaItemsInverted: []
    }
  };

  ReactDOM.render(<IntlProvider><PathBarIntl {...props} /></IntlProvider>, div);

  if(!div.querySelector('summary').innerHTML.includes(props.view.focusedMediaItem.path)) {
    const err = `summary should contain correct path expects ${props.view.focusedMediaItem.path}`;
    console.log(err);
    throw new Error(err);
  }
});

it('renders a snapshot', () => {
  const props = {
    config: {
      allowRename: false,
      allowDelete: false
    },
    view: {
      focusedMediaItem: {
        directory:'/',
        absoluteURL:'cheese.jpg',
        filename:'cheese.jpg',
        path:'/cheese.jpg'
      }
    },
    content: {
      contents: [],
      chosenMediaItems: [],
      chosenMediaItemsInverted: []
    }
  };

  const pathbar = renderer.create(<IntlProvider><PathBarIntl {...props} /></IntlProvider>).toJSON();
  expect(pathbar).toMatchSnapshot();
});
