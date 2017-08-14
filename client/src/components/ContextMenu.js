import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

import ContextButtons from './ContextButtons';

const ContextMenu = (props) => {
  const item = props.item;
  return (
      <td className={props.className} hidden={props.hidden === undefined ? true : props.hidden}>
        <ContextButtons onBlur={props.onBlur} onFirstFocus={props.onFirstFocus} {...props} />
      </td>
  );
}

export default ContextMenu;
