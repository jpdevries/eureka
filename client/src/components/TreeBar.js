import React from 'react';

import Icon from './Icon';

import { FormattedMessage } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

const TreeBar = (props) => {
  const formatMessage = props.intl.formatMessage,
  uploadFileToMessage = formatMessage(definedMessages.uploadFileTo, {
    cd: props.content.cd
  }),
  createFileInMessage = formatMessage(definedMessages.createFileInMessage, {
    cd: props.content.cd
  }),
  uploadBtn = (props.config.allowUploads) ? (
    <button title={uploadFileToMessage} onClick={(event) => {
        try {
          event.target.parentNode.parentNode.querySelector('.eureka__drop-area-zone').click();
        } catch(e) {}
      }}>
      <span className="visually-hidden">{uploadFileToMessage}</span>
      <Icon {...props} icon="upload" />
    </button>
  ) : undefined,
  createFileBtn = (props.config.handlers && props.config.handlers.createFile) ? (
    <a {...props.config.handlers.createFile(props.source.currentSource, props.content.cd)} className="button" title={createFileInMessage}>
      <span className="visually-hidden">{createFileInMessage}</span>
      <Icon {...props} icon="file-text-o" />
    </a>
  ) : undefined,
  createDirectoryInMessage = formatMessage(definedMessages.createNewDirectoryIn, {
    cd: props.content.cd
  })

  return (
    <div className="eureka__tree-bar">
      <button title={createDirectoryInMessage} onClick={props.onCreateDirectory}>
        <span className="visually-hidden">{createDirectoryInMessage}</span>
        <Icon {...props} icon="plus-square" />
      </button>
      {createFileBtn}
      {uploadBtn}
    </div>
  );
}

export default TreeBar;
