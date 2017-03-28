import React from 'react';

import utility from '../utility/utility';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, defineMessages } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

const ChooseBar = (props) => {
  //console.log('ChooseBar',props);


  const { formatMessage, formatPlural } = props.intl,
  closeMediaBrowserMessage = formatMessage(definedMessages.closeMediaBrowser),
  chooseMessage = formatMessage(definedMessages.choose),
  mediaItem = formatMessage(definedMessages.mediaItem),
  pluralItemPlaceholder = formatPlural(definedMessages.pluralItem),
  cancelMessage = formatMessage(definedMessages.cancel);

  return (
    <div aria-hidden={props.ariaHidden} className="eureka__button-bar eureka__choose-bar">
      <button aria-label={closeMediaBrowserMessage} onClick={(event) => {
        console.log('closing');
        try {
          props.config.callbacks.close()
        } catch (e) {
          console.log(e)
        }
      }}>{cancelMessage}</button>
      <button id={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }choose-button`} className="eureka__primary" disabled={!props.view.focusedMediaItem && !utility.serverSideRendering} onClick={(event) => {
        if(!props.view.focusedMediaItem) return;
        try {
          props.config.callbacks.choose(props.view.focusedMediaItem)
        } catch (e) {
          console.log(e)
        }
      }}>{chooseMessage} <span className="visually-hidden"> {(() => {
          try {
            return props.view.focusedMediaItem.filename || ` ${pluralItemPlaceholder}`
          } catch (e) {
            return ` ${mediaItem}`;
          }
        })()}</span></button>
    </div>
  );
}

export default ChooseBar;
