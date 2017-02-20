import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

import ContextButtons from './ContextButtons';

const ContextMenu = (props) => {  
  const item = props.item;
  return (
    <tr className="eureka__context-row" hidden={props.hidden === undefined ? true : props.hidden}>
      <td colSpan="5">
        <ContextButtons {...props} />
      </td>
    </tr>
  );
}

export default ContextMenu;

