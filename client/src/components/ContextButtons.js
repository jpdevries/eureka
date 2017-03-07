import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

const ContextButtons = (props) => {
  const item = props.item;
  return (
    <div className="eureka__button-bar eureka__context-buttons">
      <a href={item.absoluteURL} target={`_${item.filename}`} className="button" title={`Expand ${item.filename}`}>Expand<span className="visually-hidden"> {item.filename}</span></a>
      <button title={`Choose ${item.filename}`} onClick={(event) => {
        document.dispatchEvent(new CustomEvent('EurekaFoundIt', {
          detail: item
        }));
      }}>Choose<span className="visually-hidden"> {item.filename}</span></button>
      <button title={`Rename ${item.filename}`} onClick={props.onRenameItem ? props.onRenameItem.bind(null, item) : undefined}>Rename<span className="visually-hidden"> {item.filename}</span></button>
      <button onClick={(event) => {
          store.dispatch(actions.deleteMediaItem(props.source.currentSource, item.absolutePath));
        }} title={`Delete ${item.filename}`} className="dangerous">Delete<span className="visually-hidden"> {item.filename}</span></button>
    </div>
  );
}

export default ContextButtons;

