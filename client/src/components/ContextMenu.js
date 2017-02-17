import React from 'react';

const ContextMenu = (props) => {  
  const item = props.item;
  return (
    <tr hidden={props.hidden === undefined ? true : props.hidden}>
      <td colSpan="5">
        <div className="eureka__button-bar eureka__context-buttons">
          <a href={item.absoluteURL} target={`_${item.filename}`} title={`Expand ${item.filename}`}>Expand<span className="visually-hidden"> {item.filename}</span></a>
          <button title={`Choose ${item.filename}`}>Choose<span className="visually-hidden"> {item.filename}</span></button>
          <button title={`Rename ${item.filename}`}>Rename<span className="visually-hidden"> {item.filename}</span></button>
          <button title={`Delete ${item.filename}`} className="dangerous">Delete<span className="visually-hidden"> {item.filename}</span></button>
        </div>
      </td>
    </tr>
  );
}

export default ContextMenu;

