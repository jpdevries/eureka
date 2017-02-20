import React from 'react';

import Icon from './Icon';

import ContextButtons from './ContextButtons';

const PathBar = (props) => {
  const contextBtns = props.view.focusedMediaItem ? (
    <ContextButtons {...props} item={props.view.focusedMediaItem} />
  ) : undefined;
  
  return (
    <div className="eureka__pathbar">
      <div className="eureka__hide-for-mobile-up" aria-hidden="true">
        <details>
          <summary>
            <Icon icon="file-image-o" />&ensp;
            {`${props.view.focusedMediaItem.directory}${props.view.focusedMediaItem.filename}`}
          </summary>
          <div>
            <div>
              <img src={props.view.focusedMediaItem.absoluteURL} alt="" />
            </div>
            {contextBtns}
          </div>
        </details>
      </div>
      <div className="eureka__show-for-mobile-up">
        <Icon icon="file-image-o" />&ensp;
        {`${props.view.focusedMediaItem.directory}${props.view.focusedMediaItem.filename}`}
      </div>
    </div>
  )
};

export default PathBar;