import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

import {cssSafe} from '../utility/utility';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, defineMessages } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

const ContextButtons = (props) => {
  //console.log('ContextButtons', props);
  const item = props.item;

  const decoratedActions = props.decoratedActions ? Object.assign({}, actions, props.decoratedActions) : actions;

  const { formatMessage } = props.intl,
  renameMessage = formatMessage(definedMessages.rename),
  renameItemMessage = formatMessage(definedMessages.renameItem, {
    filename: ` ${item.filename}`
  }),
  performContextualActionsMessage = formatMessage(definedMessages.performContextualActions, {
    filename: item.filename
  }),
  expandMessage = formatMessage(definedMessages.expand),
  chooseItemMessage = formatMessage(definedMessages.chooseItem, {
    filename: item.filename
  }),
  chooseMessage = formatMessage(definedMessages.choose),
  deleteMessage = formatMessage(definedMessages.delete),
  deleteItemMessage = formatMessage(definedMessages.deleteItem, {
    filename: item.filename
  }),
  expandItemMessage = formatMessage(definedMessages.expandItem, {
    filename: item.filename
  });

  const renameBtn = (props.config.allowRename) ? (<button id={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }rename__${cssSafe(item.filename)}`} role="option" title={renameItemMessage} onClick={props.onRenameItem ? props.onRenameItem.bind(null, item) : undefined}>{renameMessage}<span className="visually-hidden"> {item.filename}</span></button>) : undefined,
  deleteBtn = (props.config.allowDelete) ? (
    <button id={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }delete__${cssSafe(item.filename)}`} role="option" onClick={(event) => {
        store.dispatch(decoratedActions.deleteMediaItem(props.source.currentSource, item.path));
      }} title={deleteItemMessage} className="dangerous">{deleteMessage}<span className="visually-hidden"> {item.filename}</span></button>
  ) : undefined;



  return ( // future-role="toolbar listbox"
    <div className="eureka__button-bar eureka__context-buttons" role="listbox"  aria-label={performContextualActionsMessage} tabIndex="0" aria-activedescendant={`expand__${cssSafe(item.filename)}`}>
      <a role="option" id={`expand__${cssSafe(item.filename)}`} href={item.absoluteURL} target={`_${encodeURI(item.absoluteURL)}`} className="button" title={expandItemMessage}>{expandMessage}<span className="visually-hidden"> {item.filename}</span></a>
      <button role="option" id={`choose__${cssSafe(item.filename)}`} title={chooseItemMessage} onClick={(event) => {
        document.dispatchEvent(new CustomEvent('EurekaFoundIt', {
          detail: item
        }));
      }}>{chooseMessage}<span className="visually-hidden"> {item.filename}</span></button>
    {renameBtn}
    {deleteBtn}
    </div>
  );
}

export default ContextButtons;
