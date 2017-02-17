import React from 'react';

const TreeBar = (props) => {
  
  return (
    <div className="eureka__tree-bar">
      <button title={`Create a new Directory in ${props.content.cd}`}>
        <span className="visually-hidden">Create a new Directory in {props.content.cd}</span>
        <svg aria-hidden="true" className="icon icon-plus-square">
            <use xlinkHref={`assets/img/icons.svg#icon-plus-square`}></use>
        </svg>
      </button>
      <button title={`Upload File to ${props.content.cd}`}>
        <span className="visually-hidden">Upload File to {props.content.cd}</span>
        <svg aria-hidden="true" className="icon icon-upload">
            <use xlinkHref={`assets/img/icons.svg#icon-upload`}></use>
        </svg>
      </button>
    </div>
  );
}

export default TreeBar;

