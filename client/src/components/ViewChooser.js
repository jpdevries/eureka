import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

import Icon from './Icon';

import { FormattedMessage } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

const ViewChooser = (props) => {
  const formatMessage = props.intl.formatMessage,
  tabularLayoutMessage = formatMessage(definedMessages.tabularLayoutDescription),
  thumbLayoutMessage = formatMessage(definedMessages.thumbnailLayoutDescription),
  gridLayoutMessage = formatMessage(definedMessages.gridLayoutDescription),
  listLayoutMessage = formatMessage(definedMessages.listLayoutDescription);

  return (
    <form className="eureka__layout-chooser">
      <fieldset>
        <legend>Choose a Layout Mode</legend>

        <div className="eureka__icon-radio-btns">
          <div>
            <input type="radio" id="eureka__view-table" name="eureka__view" onChange={(event) => (
              store.dispatch(actions.updateView({
                mode: event.target.value
              }))
              )} checked={props.view.mode === 'table'} value="table" />&emsp;
            <label htmlFor="eureka__view-table" title={tabularLayoutMessage}>
              <Icon {...props} icon="th-list" />
              <span className="visually-hidden"><FormattedMessage id="layout.table" defaultMessage="Table Layout" /></span>
            </label>
          </div>

          <div>
            <input type="radio" id="eureka__view-thumb" name="eureka__view" onChange={(event) => (
              store.dispatch(actions.updateView({
                mode: event.target.value
              }))
              )} checked={props.view.mode === 'thumb'} value="thumb" />&emsp;
            <label htmlFor="eureka__view-thumb" title={thumbLayoutMessage}>
              <Icon {...props} icon="th-large" />
              <span className="visually-hidden"><FormattedMessage id="layout.thumb" defaultMessage="Thumbnail Layout" /></span>
            </label>
          </div>

          <div>
            <input type="radio" id="eureka__view-grid" name="eureka__view" onChange={(event) => (
              store.dispatch(actions.updateView({
                mode: event.target.value
              }))
              )} checked={props.view.mode === 'grid'} value="grid" />&emsp;
            <label htmlFor="eureka__view-grid" title={gridLayoutMessage}>
              <Icon {...props} icon="square" />
              <span className="visually-hidden"><FormattedMessage id="layout.grid" defaultMessage="Grid Layout" /></span>
            </label>
          </div>

          <div>
            <input type="radio" id="eureka__view-list" name="eureka__view" onChange={(event) => (
              store.dispatch(actions.updateView({
                mode: event.target.value
              }))
              )} checked={props.view.mode === 'list'} value="list" />&emsp;
            <label htmlFor="eureka__view-list" title={listLayoutMessage}>
              <Icon {...props} icon="list" />
              <span className="visually-hidden"><FormattedMessage id="layout.list" defaultMessage="List Layout" /></span>
            </label>
          </div>
        </div>

      </fieldset>
    </form>
  );
}

export default ViewChooser;
