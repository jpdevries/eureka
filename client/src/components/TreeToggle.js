import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

import Icon from './Icon';

const TreeToggle = (props) => {
  //<Icon {...props} icon={`caret-square-o-${props.view.sourceTreeOpen ? 'left' : 'right'}`} />&ensp;
  return (
    
      <div>
        <button id="eureka__tree-toggle__button" aria-controls="eureka__pathbrowser" aria-expanded={props.view.sourceTreeOpen} onClick={(event) => {
          store.dispatch(actions.updateView({
            sourceTreeOpen: !props.view.sourceTreeOpen
          }))  
        }}>
          {`${props.view.sourceTreeOpen ? 'Close' : 'Open'} Media Source Tree`}
        </button>
      </div>
    
  );
}

export default TreeToggle;

