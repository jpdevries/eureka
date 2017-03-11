import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

import {cssSafe} from '../utility/utility';

const ContextButtons = (props) => {
  const item = props.item;
  return (
    <div className="eureka__button-bar eureka__context-buttons" role="listbox" aria-label="YOLO" tabindex="0" aria-activedescendant={`expand__${cssSafe(item.filename)}`}>
      <a role="option" id={`expand__${cssSafe(item.filename)}`} href={item.absoluteURL} target={`_${item.filename}`} className="button" title={`Expand ${item.filename}`}>Expand<span className="visually-hidden"> {item.filename}</span></a>
      <button role="option" id={`choose__${cssSafe(item.filename)}`} title={`Choose ${item.filename}`} onClick={(event) => {
        document.dispatchEvent(new CustomEvent('EurekaFoundIt', {
          detail: item
        }));
      }}>Choose<span className="visually-hidden"> {item.filename}</span></button>
    <button id={`rename__${cssSafe(item.filename)}`} role="option" title={`Rename ${item.filename}`} onClick={props.onRenameItem ? props.onRenameItem.bind(null, item) : undefined}>Rename<span className="visually-hidden"> {item.filename}</span></button>
      <button id={`delete__${cssSafe(item.filename)}`} role="option" onClick={(event) => {
          store.dispatch(actions.deleteMediaItem(props.source.currentSource, item.absolutePath));
        }} title={`Delete ${item.filename}`} className="dangerous">Delete<span className="visually-hidden"> {item.filename}</span></button>
    </div>
  );
}

export default ContextButtons;

