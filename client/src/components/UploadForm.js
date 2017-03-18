import React, { Component } from 'react';

import store from '../model/store';
import actions from '../model/actions';

var classNames = require('classnames');

import utility from './../utility/utility';

class UploadForm extends Component {


  handleSubmit(event) {
    const props = this.props;

     event.preventDefault();
     console.log('handleSubmit!!!', props);
     const formData = new FormData(event.target);
     for(var pair of formData.entries()) {
       console.log(pair[0], pair[1]);
    }
    store.dispatch(actions.uploadFiles(props.source.currentSource, props.content.cd, formData));
  }

  render() {
    const props = this.props;
    const submit = utility.serverSideRendering ? <button type="submit" formmethod="post">Upload Files</button> : undefined;
    const form = (utility.serverSideRendering) ? (
      <div>
          <label htmlFor="eureka__upload-form">Upload Files<span className={classNames({"visually-hidden": !utility.serverSideRendering})} > to {props.content.cd}</span>:&ensp;</label>
          <input id="eureka__upload-form" multiple="multiple" name="eureka__uploadFiles" type="file" onChange={(e) => {
              this.form.dispatchEvent(new Event("submit")); // so there is no click button they need to click
          }} />
          {submit}
      </div>
    ) : (
      <form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data" ref={(form) => { this.form = form; }}>
          <label htmlFor="eureka__upload-form">Upload Files<span className="visually-hidden"> to {props.content.cd}</span>:&ensp;</label>
          <input id="eureka__upload-form" multiple="multiple" name="eureka__uploadFiles" type="file" onChange={(e) => {
              this.form.dispatchEvent(new Event("submit")); // so there is no click button they need to click
          }} />
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
