import React, { PureComponent } from 'react';

import Dropzone from 'react-dropzone';

import store from '../model/store';
import actions from '../model/actions';

import Icon from './Icon';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, defineMessages } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

class DropArea extends PureComponent {
  constructor(props) {
    super(props);

    this.decoratedActions = props.decoratedActions ? Object.assign({}, actions, props.decoratedActions) : actions;
  }

  onDrop(files) {
    const props = this.props;
    //console.log('Received files: ', files);

    const decoratedActions = this.decoratedActions;

    const formData = new FormData();

    files.forEach((file) => {
      formData.append('eureka__uploadFiles', file, file.name);
    });
    store.dispatch(actions.updateView({
      isUploading: true
    }));
    store.dispatch(decoratedActions.uploadFiles(props.source.currentSource, props.content.cd, formData, props.config.headers))
  }

  render() {
    const props = this.props,
    formatMessage = props.intl.formatMessage,
    pastImageFromClipboardMessage = formatMessage(definedMessages.pastImageFromClipboardMessage, {
    }),
    dragFilesToBeUploadedToMessage = (props.view.isUploading) ? formatMessage(definedMessages.dragFilesUploading, {
      cd: props.content.cd
    }) : formatMessage(definedMessages.dragFilesToBeUploadedTo, {
      cd: props.content.cd
    });

    return (
      <div tabIndex="0" aria-label={pastImageFromClipboardMessage} className={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }drop-area`} title={dragFilesToBeUploadedToMessage}>
        <Dropzone onDrop={this.onDrop.bind(this)} className={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }drop-area-zone`} activeClassName={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }drop-area-zone-active`} style={{}} >
          <Icon {...props} icon={props.view.isUploading ? 'circle-o-notch' : 'upload'} />
        </Dropzone>
      </div>
    );
  }
}

export default DropArea;
