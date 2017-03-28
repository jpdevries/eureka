import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

import Icon from './Icon';

//import { FormattedMessage } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

const TreeToggle = (props) => {
  const formatMessage = props.intl.formatMessage,
  closeMessage = formatMessage(definedMessages.close),
  openMessage = formatMessage(definedMessages.open),
  mediaSourceTreeMessage = formatMessage(definedMessages.mediaSourceTreeMessage);
  //<Icon {...props} icon={`caret-square-o-${props.view.sourceTreeOpen ? 'left' : 'right'}`} />&ensp;
  return (

      <div>
        <button id="eureka__tree-toggle__button" aria-controls="eureka__pathbrowser" aria-expanded={props.view.sourceTreeOpen} onClick={(event) => {
          store.dispatch(actions.updateView({
            sourceTreeOpen: !props.view.sourceTreeOpen
          }))  
        }}>
          {`${props.view.sourceTreeOpen ? closeMessage : openMessage} ${mediaSourceTreeMessage}`}
        </button>
      </div>

  );
}

export default TreeToggle;
