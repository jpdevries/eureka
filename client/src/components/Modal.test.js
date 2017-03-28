import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';

import renderer from 'react-test-renderer';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from '../../i18n/locales/data.json';

addLocaleData([...en]);

const ModalIntl = injectIntl(Modal);

const Ipsum = (props) => (
  <div>
    <p>Hello World</p>
  </div>
)

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render((
    <IntlProvider>
    <ModalIntl>
      <Ipsum />
    </ModalIntl>
    </IntlProvider>
  ), div);
});

it('renders a snapshot', () => {
  const modal = renderer.create(
    <IntlProvider>
    <ModalIntl>
      <Ipsum />
    </ModalIntl>
    </IntlProvider>
  ).toJSON();
  expect(modal).toMatchSnapshot();
});
