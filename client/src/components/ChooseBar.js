import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

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
  fileNames = props.content.chosenMediaItemsInverted.map((item) => (
    item.filename
  )),
  deleteBtnFormFileNames = props.content.chosenMediaItemsInverted.map((item) => (
    <input type="hidden" name="delete_file[]" key={item.filename} value={item.filename} />
  )),
  len = props.content.chosenMediaItemsInverted.length,  //(props.view.selectionInverted) ? props.content.contents.length - props.content.chosenMediaItems.length : props.content.chosenMediaItems.length,
  pluralChooseItemPlaceholder = definedMessages.pluralChoose[
    formatPlural({
      value: len
    })
  ],
  cancelMessage = formatMessage(definedMessages.cancel),
  postChooseMessage = (len > 1 && props.view.chooseMultiple) ? (
    ` ${len} ${pluralChooseItemPlaceholder}`
  ) : (
    <span className="visually-hidden"> {(() => {
        try {
          return props.view.focusedMediaItem.filename || ` ${pluralItemPlaceholder}`
        } catch (e) {
          return ` ${mediaItem}`;
        }
      })()}</span>
  ),
  chooseBtn = (props.config.allowChoose) ? (
    <button aria-describedby={`${props.config.storagePrefix}selected_file_names`} id={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }choose-button`} className="eureka__primary" disabled={!props.view.focusedMediaItem && !utility.serverSideRendering} onClick={(event) => {
      if(props.view.chooseMultiple) {
        if(props.view.selectionInverted) props.config.callbacks.choose(props.content.chosenMediaItemsInverted)
        else props.config.callbacks.choose(props.content.chosenMediaItems)
        return;
      }
      if(!props.view.focusedMediaItem) return;
      try {
        props.config.callbacks.choose(props.view.focusedMediaItem)
      } catch (e) {
        console.log(e)
      }
    }}>{chooseMessage}{postChooseMessage}

    </button>
  ) : undefined,
  deleteBtn = (len > 1 && props.view.chooseMultiple) ? (
    <form onSubmit={(event) => {
      event.preventDefault();
      event.stopPropagation();
      const formData = new FormData(event.target);
      /*for(var pair of formData.entries()) {
         console.log(pair[0]+ ', '+ pair[1]);
      }*/

      //console.log('yolo', formData.getAll('delete_file[]'));

      store.dispatch(actions.deleteMediaItems(props.source.currentSource, formData, props.config.headers)).then(() => {
        store.dispatch(actions.notify(`Deleted ${formData.getAll('delete_file[]').length} ${definedMessages.pluralItem[formatPlural({
          value: formData.getAll('delete_file[]').length
        })]}`, utility.DANGEROUS));
      });

      /*for (var value of formData.values()) {
        console.log(value);
      }*/
    }}>
      <input type="hidden" name="cd" value={props.content.cd} />
      <input type="hidden" name="cs" value={props.source.currentSource} />
      {deleteBtnFormFileNames}
      <button className="dangerous"><FormattedMessage id="delete" defaultValue="Delete" />{postChooseMessage}</button>
    </form>
  ) : undefined;

  return (
    <div aria-hidden={props.ariaHidden} className="eureka__button-bar eureka__choose-bar">
      <button aria-label={closeMediaBrowserMessage} onClick={(event) => {
        //console.log('closing');
        try {
          props.config.callbacks.close()
        } catch (e) {
          console.log(e)
        }
      }}>{cancelMessage}</button>
      {deleteBtn}
    {chooseBtn}
    </div>
  );
}

export default ChooseBar;
