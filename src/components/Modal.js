import React, { Component } from 'react';

const Modal = (props) => {
  return (
    <div className="eureka__modal">
      <div className="eureka__modal-panel">
        <h2>
          {props.title}
        </h2>
        
        {React.cloneElement(React.Children.only(props.children), props)}
        
      </div>
      <div role="button" tabIndex="0" 
 aria-pressed="false" className="eureka__modal-scrim" onClick={props.onCancel}>
        <span className="visually-hidden">Close {props.title} Modal Window</span>
      </div>
    </div>
  );
};

export default Modal;