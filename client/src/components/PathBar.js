import React from 'react';

import Icon from './Icon';

import ContextButtons from './ContextButtons';

import path from 'path';

import utility from './../utility/utility';

var pathParse = require('path-parse');

/*
Example of file
Example of file-archive-o
Example of file-audio-o
Example of file-code-o
Example of file-excel-o
Example of file-image-o
Example of file-movie-o (alias)
Example of file-o
Example of file-pdf-o
Example of file-photo-o (alias)
Example of file-picture-o (alias)
Example of file-powerpoint-o
Example of file-sound-o (alias)
Example of file-text
Example of file-text-o
Example of file-video-o
Example of file-word-o
Example of file-zip-o
*/

const PathBar = (props) => {
  const contextBtns = props.view.focusedMediaItem ? (
    <ContextButtons {...props} item={props.view.focusedMediaItem} />
  ) : undefined;



  const icon = utility.getIconByExtension(pathParse(props.view.focusedMediaItem.filename).ext);

  return (
    <div className="eureka__pathbar">
      <div className="eureka__hide-for-mobile-up" aria-hidden="true">
        <details>
          <summary>
            <Icon icon={icon} />&ensp;
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
        <a role="presentation" href={props.view.focusedMediaItem.absoluteURL} target={`_${encodeURI(props.view.focusedMediaItem.absoluteURL)}`}>
          <Icon icon={icon} />&ensp;
          {path.join(props.view.focusedMediaItem.directory, props.view.focusedMediaItem.filename)}
        </a>
      </div>
    </div>
  )
};

export default PathBar;
