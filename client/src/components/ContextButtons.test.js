import React from 'react';
import ReactDOM from 'react-dom';
import ContextButtons from './ContextButtons';

import {cssSafe} from '../utility/utility';

import renderer from 'react-test-renderer';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from '../../i18n/locales/en.json';

addLocaleData([...en]);

const ContextButtonsIntl = injectIntl(ContextButtons);

it('renders without crashing', () => {
  const div = document.createElement('div');
  const item = {
    filename: 'sky.jpg'
  };

  const props = {
    config: {
      allowRename: true,
      storagePrefix: 'eureka__'
    }
  };

  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><ContextButtonsIntl item={item} {...props} /></IntlProvider>, div);

});

it('should add a rename button if config.allowRename is true', () => {
  const div = document.createElement('div');
  const item = {
    filename: 'sky.jpg'
  };

  const props = {
    config: {
      allowRename: true,
      storagePrefix: 'eureka__'
    }
  };

  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><ContextButtonsIntl item={item} {...props} /></IntlProvider>, div);

  if(!div.querySelector(`#${props.config.storagePrefix}rename__${cssSafe(item.filename)}`)) {
    const err = `should add a rename button if config.allowRename is true`;
    throw new Error(err);
  }

});

it('should not add a rename button if config.allowRename is not true', () => {
  const div = document.createElement('div');
  const item = {
    filename: 'sky.jpg'
  };

  const props = {
    config: {
      allowRename: false,
      storagePrefix: 'eureka__'
    }
  };

  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><ContextButtonsIntl item={item} {...props} /></IntlProvider>, div);

  if(div.querySelector(`#${props.config.storagePrefix}rename__${cssSafe(item.filename)}`)) {
    const err = `should not add a rename button if config.allowRename is not true`;
    throw new Error(err);
  }

});

it('renders a snapshot', () => {
  const item = {
    filename: 'sky.jpg'
  };

  const props = {
    config: {
      allowRename: false,
      storagePrefix: 'eureka__'
    }
  };
  const contextButtons = renderer.create(<IntlProvider><ContextButtonsIntl item={item} {...props} /></IntlProvider>).toJSON();
  expect(contextButtons).toMatchSnapshot();
});
