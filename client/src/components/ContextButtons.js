import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

import { cssSafe, notify, DANGEROUS } from '../utility/utility';

import path from 'path';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, defineMessages } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

const ContextButtons = (props) => {
  //console.log('ContextButtons', props);
  const item = props.item;

  const decoratedActions = props.decoratedActions ? Object.assign({}, actions, props.decoratedActions) : actions;

  const { formatMessage } = props.intl,
  renameMessage = formatMessage(definedMessages.rename),
  renameItemMessage = formatMessage(definedMessages.renameItem, {
    item: ` ${item.filename}`
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
  deletedItemMessage = formatMessage(definedMessages.deletedItem, {
    filename: item.filename
  }),
  expandItemMessage = formatMessage(definedMessages.expandItem, {
    filename: item.filename
  }),
  downloadMessage = formatMessage(definedMessages.download),
  downloadItemMessage = formatMessage(definedMessages.downloadItem, {
    filename: item.filename
  }),
  deleteAreYouSureMessage = formatMessage(definedMessages.deleteAreYouSureMessage, {
    filename: item.filename
  });
  const chooseBtn = (props.config.allowChoose) ? (
    <button role="option" id={`choose__${cssSafe(item.filename)}`} title={chooseItemMessage} onClick={(event) => {
      if(!props.view.focusedMediaItem) return;
      try {
        props.config.callbacks.choose(item);
      } catch (e) {
        console.log(e);
      }
      /*document.dispatchEvent(new CustomEvent('EurekaFoundIt', {
        detail: item
      }));*/
    }}>{chooseMessage}<span className="visually-hidden"> {item.filename}</span></button>
) : undefined,
  renameBtn = (props.config.allowRename) ? (<button id={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }rename__${cssSafe(item.filename)}`} role="option" title={renameItemMessage} onClick={props.onRenameItem ? props.onRenameItem.bind(null, item) : undefined}>{renameMessage}<span className="visually-hidden"> {item.filename}</span></button>) : undefined,
  deleteBtn = (props.config.allowDelete) ? (
    <button id={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }delete__${cssSafe(item.filename)}`} role="option" onClick={(event) => {
        if(!props.config.confirmBeforeDelete) {
          deleteIt();
        } else if(confirm(deleteAreYouSureMessage)) {
          deleteIt();
        }
        function deleteIt() {
          store.dispatch(decoratedActions.deleteMediaItem(props.source.currentSource, item.path, props.config.headers)).then(() => {
            store.dispatch(actions.notify(deletedItemMessage, DANGEROUS));
          });
        }
      }} title={deleteItemMessage} className="dangerous">{deleteMessage}<span className="visually-hidden"> {item.filename}</span></button>
  ) : undefined,
  downloadID = `${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }download__${cssSafe(item.filename)}`,
  downloadBtn = (props.config.allowDownload) ? (
    <a download={item.filename} href={item.absoluteURL} id={downloadID} className="button" target={`_${downloadID}`} title={downloadItemMessage}>{downloadMessage}<span className="visually-hidden"> {item.filename}</span></a>
  ) : undefined;



  return ( // future-role="toolbar listbox"
    <div className="eureka__button-bar eureka__context-buttons" role="listbox"  aria-label={performContextualActionsMessage} tabIndex="0" aria-activedescendant={`expand__${cssSafe(item.filename)}`}>
      <a onBlur={props.onBlur} role="option" id={`expand__${cssSafe(item.filename)}`} href={item.absoluteURL} target={`_${encodeURI(item.absoluteURL)}`} className="button" title={expandItemMessage}>{expandMessage}<span className="visually-hidden"> {item.filename}</span></a>
      {chooseBtn}
    {renameBtn}
    {deleteBtn}
    {downloadBtn}
    </div>
  );
}

export default ContextButtons;
