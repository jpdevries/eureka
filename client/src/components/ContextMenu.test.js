import React from 'react';
import ReactDOM from 'react-dom';
import ContextMenu from './ContextMenu';

import {cssSafe} from '../utility/utility';

import renderer from 'react-test-renderer';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import localeData from '../../i18n/locales/en.json';

addLocaleData([...en]);

const ContextMenuIntl = injectIntl(ContextMenu);

it('renders without crashing', () => {
  const tr = document.createElement('tr');
  const item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><ContextMenuIntl config={{
    allowRename:true,
    allowDelete:true,
    storagePrefix:'eureka__'
  }} item={item} hidden={false}  /></IntlProvider>, tr);

});

it('should contain a delete button if allowDelete is true', () => {
  const tr = document.createElement('tr');
  const item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><ContextMenuIntl config={{
    allowRename:true,
    allowDelete:true,
    storagePrefix:'eureka__'
  }} item={item} hidden={false}  /></IntlProvider>, tr);

  if(!tr.querySelector(`#eureka__delete__${cssSafe(item.filename)}`)) {
    const err = 'it should contain a delete button if allowDelete is true';
    console.log(err);
    throw new Error(err);
  }

});

it('should not contain a delete button if allowDelete is not true', () => {
  const tr = document.createElement('tr');
  const item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><ContextMenuIntl config={{
    allowRename:true,
    allowDelete:false,
    storagePrefix:'eureka__'
  }} item={item} hidden={false}  /></IntlProvider>, tr);

  if(tr.querySelector(`#eureka__delete__${cssSafe(item.filename)}`)) {
    const err = 'it should not contain a delete button if allowDelete is not true';
    console.log(err);
    throw new Error(err);
  }

});

it('should contain a rename button if allowRename is true', () => {
  const tr = document.createElement('tr');
  const item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><ContextMenuIntl config={{
    allowRename:true,
    allowDelete:true,
    storagePrefix:'eureka__'
  }} item={item} hidden={false}  /></IntlProvider>, tr);

  if(!tr.querySelector(`#eureka__rename__${cssSafe(item.filename)}`)) {
    const err = 'it should contain a rename button if allowRename is true';
    console.log(err);
    throw new Error(err);
  }

});

it('should not contain a rename button if allowRename is not true', () => {
  const tr = document.createElement('tr');
  const item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><ContextMenuIntl config={{
    allowRename:false,
    allowDelete:true,
    storagePrefix:'eureka__'
  }} item={item} hidden={false}  /></IntlProvider>, tr);

  if(tr.querySelector(`#eureka__rename__${cssSafe(item.filename)}`)) {
    const err = 'it should not contain a rename button if allowRename is not true';
    console.log(err);
    throw new Error(err);
  }

});

it('should be semantically hidden if hidden is true', () => {
  const tr = document.createElement('tr');
  const item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><ContextMenuIntl config={{
    allowRename:false,
    allowDelete:true,
    storagePrefix:'eureka__'
  }} item={item} hidden={true}  /></IntlProvider>, tr);

  if(!tr.querySelector(`td`).hasAttribute('hidden')) {
    const err = 'it should be semantically hidden if hidden is not true';
    console.log(err);
    throw new Error(err);
  }

});

it('should not be semantically hidden if hidden is not true', () => {
  const tr = document.createElement('tr');
  const item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  ReactDOM.render(<IntlProvider><ContextMenuIntl config={{
    allowRename:false,
    allowDelete:true,
    storagePrefix:'eureka__'
  }} item={item} hidden={false}  /></IntlProvider>, tr);

  if(tr.querySelector(`td`).hasAttribute('hidden')) {
    const err = 'it should be semantically hidden if hidden is not true';
    console.log(err);
    throw new Error(err);
  }

});

it('renders a snapshot', () => {
  const item = {
    filename: 'sky.jpg'
  },
  icon = renderer.create((
    <IntlProvider><ContextMenuIntl config={{
      allowRename:false,
      allowDelete:true,
      storagePrefix:'eureka__'
    }} item={item} hidden={false}  /></IntlProvider>
  )).toJSON();

  expect(icon).toMatchSnapshot();
});
