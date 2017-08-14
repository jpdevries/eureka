import React, { Component } from 'react';

import { FormattedMessage } from 'react-intl';

import Icon from './Icon';

const Modal = (props) => {
  const spinner = (props.showSpinner) ? (
    <span className="spinner"><Icon {...props} icon="circle-o-notch" />&emsp;</span>
  ) : undefined;
  return (
    <div className={`eureka__modal ${props.className}`} role="dialog">
      <div className="eureka__modal-panel">
        <h2>
          {spinner}
          {props.title}
        </h2>

        {React.cloneElement(React.Children.only(props.children), props)}

      </div>
      <div role="button" tabIndex="0"
 aria-pressed="false" className="eureka__modal-scrim" onClick={props.onCancel}>
        <span className="visually-hidden test">
          <FormattedMessage id="modal.closeWindow" defaultMessage={`Close {title} Modal Window`} values={{
            title: props.title
          }} />
        </span>
      </div>
    </div>
  );
};

export default Modal;
