import React from 'react';
import ReactDOM from 'react-dom';
import TreeToggle from './TreeToggle';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from '../../i18n/locales/en.json';

addLocaleData([...en]);

const TreeToggleIntl = injectIntl(TreeToggle);

it('renders without crashing', () => {
  const div = document.createElement('div');
  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><TreeToggleIntl view={{
    sourceTreeOpen:true
  }} /></IntlProvider>, div);
});

it('should prompt user to open the tree when the tree is closed', () => {
  const div = document.createElement('div');
  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><TreeToggleIntl view={{
    sourceTreeOpen:false
  }} /></IntlProvider>, div);

  if(div.querySelector('#eureka__tree-toggle__button').getAttribute('aria-expanded') !== 'false') {
    const err = `Tree toggle button should prompt users to open the three when the tree is closed`;
    console.log(err);
    throw new Error(err);
  }
});

it('should prompt user to close the tree when the tree is open', () => {
  const div = document.createElement('div');
  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><TreeToggleIntl view={{
    sourceTreeOpen:true
  }} /></IntlProvider>, div);

  if(div.querySelector('#eureka__tree-toggle__button').getAttribute('aria-expanded') !== 'true') {
    const err = `Tree toggle button should prompt users to close the three when the tree is open`;
    console.log(err);
    throw new Error(err);
  }
});

it('should contain the aria-controls attribute', () => {
  const div = document.createElement('div');
  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><TreeToggleIntl view={{
    sourceTreeOpen:true
  }} /></IntlProvider>, div);

  if(!div.querySelector(`#eureka__tree-toggle__button`).hasAttribute('aria-controls')) {
    const err = `Tree toggle button should contain the aria-controls attribute`;
    console.log(err);
    throw new Error(err);
  }

});

it('should contain the aria-expanded attribute', () => {
  const div = document.createElement('div');
  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><TreeToggleIntl view={{
    sourceTreeOpen:true
  }} /></IntlProvider>, div);

  if(!div.querySelector(`#eureka__tree-toggle__button`).hasAttribute('aria-expanded')) {
    const err = `Tree toggle button should contain the aria-expanded attribute`;
    console.log(err);
    throw new Error(err);
  }

});

it('should have an aria-expanded attribute based on sourceTreeOpen', () => {
  const div = document.createElement('div');
  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><TreeToggleIntl view={{
    sourceTreeOpen:true
  }} /></IntlProvider>, div);

  if(!((div.querySelector(`#eureka__tree-toggle__button`).getAttribute('aria-expanded') == "true") ? true : false)) {
    const err = `Should have an aria-expanded attribute of true`;
    console.log(err);
    throw new Error(err);
  }

});
