import React from 'react';

import Icon from './Icon';

import ContextButtons from './ContextButtons';

import path from 'path';

import utility from './../utility/utility';

import MediaEmbed from './MediaEmbed';

import definedMessages from './../i18n/definedMessages';

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
  const formatMessage = props.intl.formatMessage;
  const contextBtns = props.view.focusedMediaItem ? (
    <ContextButtons {...props} idPrefix="pathbar" item={props.view.focusedMediaItem} />
  ) : undefined;

  const copyListofSelectedFiles = formatMessage(definedMessages.copyListofSelectedFiles);

  const icon = utility.getIconByExtension(pathParse(props.view.focusedMediaItem.filename).ext);
  const p = (props.view.chooseMultiple && props.content.chosenMediaItems.length > 1) ? props.view.focusedMediaItem.directory : path.join(props.view.focusedMediaItem.directory, props.view.focusedMediaItem.filename);
  const fileNames = props.content.chosenMediaItemsInverted.map((item) => (
    item.filename
  ));
  //console.log('props.content.chosenMediaItems', props.content.chosenMediaItems);
  //console.log('fileNames', fileNames);
  const len = (props.view.selectionInverted) ? props.content.contents.length - props.content.chosenMediaItems.length : props.content.chosenMediaItems.length;
  const fileNamesIf = (len > 1 && props.view.chooseMultiple) ? <textarea aria-live="polite" aria-readonly="true" aria-label={copyListofSelectedFiles} rows="10" cols="50" onClick={(event) => {
    event.target.focus();
    event.target.select();
  }}  style={{
    margin: '0'
  }} readOnly="readonly" value={fileNames.join(', ')}></textarea> : undefined,
  a = (len < 2) ? (
    <a id={`${props.config.storagePrefix}selected_file_names`} role="presentation" href={props.view.focusedMediaItem.absoluteURL} target={`_${encodeURI(props.view.focusedMediaItem.absoluteURL)}`}>
      <Icon {...props} icon={icon} />&ensp;
      {p}{fileNamesIf}
    </a>
  ) : (
    <div id={`${props.config.storagePrefix}selected_file_names`}>
      <Icon {...props} icon={icon} />&ensp;
      {p}{fileNamesIf}
    </div>
  );

  let selectedPaths = (len > 12) ? (
    <details open>
      <summary>Selected Paths</summary>
      {fileNamesIf}
    </details>
  ) : fileNamesIf;

  const mediaEmbed = (
    <MediaEmbed key={props.view.focusedMediaItem.absoluteURL} item={props.view.focusedMediaItem} {...props} />
  );


  return (
    <div className="eureka__pathbar">
      <div className="eureka__hide-for-mobile-up" aria-hidden="true">
        <details>
          <summary>
            <Icon {...props} icon={icon} />&ensp;
            {(props.view.chooseMultiple ? `${props.view.focusedMediaItem.directory}` : `${props.view.focusedMediaItem.directory}${props.view.focusedMediaItem.filename}`)}
          </summary>
          {selectedPaths}
          <div>
            <div>
              {mediaEmbed}
            </div>
            {contextBtns}
          </div>
        </details>
      </div>
      <div role="status" className="eureka__show-for-mobile-up">
        {a}
      </div>
    </div>
  )
};

export default PathBar;
