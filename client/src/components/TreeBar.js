import React from 'react';

import Icon from './Icon';

const TreeBar = (props) => {
  
  return (
    <div className="eureka__tree-bar">
      <button title={`Create a new Directory in ${props.content.cd}`} onClick={props.onCreateDirectory}>
        <span className="visually-hidden">Create a new Directory in {props.content.cd}</span>
        <Icon icon="plus-square" />
      </button>
      <button title={`Upload File to ${props.content.cd}`} onClick={(event) => {
          try {
            event.target.parentNode.parentNode.querySelector('.eureka__drop-area-zone').click();
          } catch(e) {}
        }}>
        <span className="visually-hidden">Upload File to {props.content.cd}</span>
        <Icon icon="upload" />
      </button>
    </div>
  );
}

export default TreeBar;

