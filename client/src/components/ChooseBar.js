import React from 'react';

import utility from '../utility/utility';

const ChooseBar = (props) => {
  //console.log('ChooseBar',props);
  return (
    <div aria-hidden={props.ariaHidden} className="eureka__button-bar eureka__choose-bar">
      <button aria-label="Close Media Browser">Cancel</button>
      <button id={`${props.config.storagePrefix}choose-button`} className="eureka__primary" disabled={!props.view.focusedMediaItem && !utility.serverSideRendering}>Choose <span className="visually-hidden"> {(() => {
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