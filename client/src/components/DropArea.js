import React, { Component } from 'react';

import Dropzone from 'react-dropzone';

import store from '../model/store';
import actions from '../model/actions';

import Icon from './Icon';

class DropArea extends Component {

  onDrop(files) {
    const props = this.props;
    console.log('Received files: ', files);

    const formData = new FormData();

    files.forEach((file) => {
      formData.append('eureka__uploadFiles', file, file.name);
    });

    store.dispatch(actions.uploadFiles(props.source.currentSource, props.content.cd, formData))
  }

  render() {
    const props = this.props;
    return ( //
      <div className="eureka__drop-area" title={`Drag files here to be uploaded to ${props.content.cd}`}>
        <Dropzone onDrop={this.onDrop.bind(this)} className="eureka__drop-area-zone" activeClassName="eureka__drop-area-zone-active" style={{}} >
          <Icon icon="upload" />
        </Dropzone>
      </div>
    );
  }
}

export default DropArea;
