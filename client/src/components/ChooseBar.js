import React from 'react';

const ChooseBar = (props) => {
  //console.log('ChooseBar',props);
  return (
    <div aria-hidden={props.ariaHidden} className="eureka__button-bar eureka__choose-bar">
      <button aria-label="Close Media Browser">Cancel</button>
      <button className="eureka__primary" disabled={!props.view.focusedMediaItem}>Choose <span className="visually-hidden"> {(() => {
          try {
            return props.view.focusedMediaItem.filename || ' an image'
          } catch (e) {
            return ' an image';
          } 
        })()}</span></button>
    </div>
  );
}

export default ChooseBar;

