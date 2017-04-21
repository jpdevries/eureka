import React, { PureComponent } from 'react';

import store from '../model/store';
import actions from '../model/actions';

import utility from './../utility/utility';

import Icon from './Icon';

var classNames = require('classnames');

import { FormattedMessage } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

class UploadForm extends PureComponent {
  constructor(props) {
    super(props);
    this.decoratedActions = props.decoratedActions ? Object.assign({}, actions, props.decoratedActions) : actions;
  }



  handleSubmit(event) {
    event.preventDefault();

    const props = this.props;

    const decoratedActions = this.decoratedActions;

    const formData = new FormData(event.target);
    for(var pair of formData.entries()) {
       console.log(pair[0], pair[1]);
    }
    store.dispatch(actions.updateView({
       isUploading: true
    }));
    store.dispatch(decoratedActions.uploadFiles(props.source.currentSource, props.content.cd, formData, props.config.headers));
  }

  handleLabelKeyPress(e) {
    //console.log(e.target.matches());
    //console.log(e.nativeEvent.code.toLowerCase());
    //console.log(e.target.parentNode.querySelector('input[type="file"]'));
    switch(e.nativeEvent.code.toLowerCase()) {
      case 'space':
      case 'enter':
      case 'return':
      //console.log(e.target.parentNode.querySelector('input[type="file"]'));
      e.target.parentNode.querySelector('input[type="file"]').click();
      break;
    }
  }

  render() {
    const props = this.props,
    uploadFilesMessage = (!props.view.isUploading) ? <FormattedMessage id="upload.files" defaultMessage="Upload files" /> : <FormattedMessage id="upload.dragFilesUploading" defaultMessage="Uploading files…" />,
    uploadFilesIcon = (!props.view.isUploading) ? undefined : <span className="spinner"><Icon {...props} icon="circle-o-notch" /></span>,
    submit = utility.serverSideRendering ? <button type="submit" formmethod="post">{uploadFilesMessage}</button> : undefined,
    form = (utility.serverSideRendering) ? (
      <div>
          <label tabIndex="0" role="menuitem" htmlFor="eureka__upload-form">{uploadFilesMessage}<span className={classNames({"visually-hidden": !utility.serverSideRendering})} > to {props.content.cd}</span>:&ensp;</label>
          <input id="eureka__upload-form" multiple="multiple" name="eureka__uploadFiles" type="file" />
          {submit}
      </div>
    ) : (
      <form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data" ref={(form) => { this.form = form; }}>
          <input hidden={props.view.isUploading} disabled={props.view.isUploading} id="eureka__upload-form" multiple="multiple" name="eureka__uploadFiles" type="file" onChange={(e) => {
              this.form.dispatchEvent(new Event("submit")); // so there is no click button they need to click
          }} />
          <label onKeyPress={(!props.view.isUploading) ? this.handleLabelKeyPress : undefined} tabIndex="0" role="menuitem" htmlFor={(!props.view.isUploading)? "eureka__upload-form" : undefined}>{uploadFilesIcon}{uploadFilesMessage}<span className="visually-hidden"> <FormattedMessage id="grammar.to" defaultMessage="to" /> {props.content.cd}</span></label>
      </form>
    );

    return (
      <div className="eureka__upload-form">
        {form}
      </div>
    );
  }
}

export default UploadForm;
