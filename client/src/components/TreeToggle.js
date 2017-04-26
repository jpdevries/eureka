import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

import Icon from './Icon';

//import { FormattedMessage } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

export const TreeToggle = (props) => {
  const formatMessage = props.intl.formatMessage,
  //closeMessage = formatMessage(definedMessages.close),
  //openMessage = formatMessage(definedMessages.open),
  //toggleMessage = formatMessage(definedMessages.toggle),
  mediaSourceTreeMessage = formatMessage(definedMessages.mediaSourceTreeMessage);
  //<Icon {...props} icon={`caret-square-o-${props.view.sourceTreeOpen ? 'left' : 'right'}`} />&ensp;
  return (

      <div>
        <button role="menuitem" id="eureka__tree-toggle__button" aria-controls="eureka__pathbrowser" aria-pressed={props.view.sourceTreeOpen} aria-expanded={props.view.sourceTreeOpen} onClick={(event) => {
          store.dispatch(actions.updateView({
            sourceTreeOpen: !props.view.sourceTreeOpen
          }))
        }}>
          {`${mediaSourceTreeMessage}`}
        </button>
      </div>

  );
}

export default TreeToggle;
