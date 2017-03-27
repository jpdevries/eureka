import React from 'react';

import utility from '../utility/utility';

const ChooseBar = (props) => {
  //console.log('ChooseBar',props);
  return (
    <div aria-hidden={props.ariaHidden} className="eureka__button-bar eureka__choose-bar">
      <button aria-label="Close Media Browser" onClick={(event) => {
        console.log('closing');
        try {
          props.config.callbacks.close()
        } catch (e) {
          console.log(e)
        }
      }}>Cancel</button>
      <button id={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }choose-button`} className="eureka__primary" disabled={!props.view.focusedMediaItem && !utility.serverSideRendering} onClick={(event) => {
        if(!props.view.focusedMediaItem) return;
        try {
          props.config.callbacks.choose(props.view.focusedMediaItem)
        } catch (e) {
          console.log(e)
        }
      }}>Choose <span className="visually-hidden"> {(() => {
          try {
            return props.view.focusedMediaItem.filename || ' an image'
          } catch (e) {
            return ' media item';
          }
        })()}</span></button>
    </div>
  );
}

export default ChooseBar;
